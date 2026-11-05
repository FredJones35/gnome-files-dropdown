// Files Dropdown: a panel button that drops a real Nautilus window down under
// the top bar (so files can be dragged into other apps) and closes it again
// as soon as focus moves somewhere else.

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Meta from 'gi://Meta';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const NAUTILUS_WM_CLASS = 'org.gnome.Nautilus';
const SPAWN_TIMEOUT_SECONDS = 10;
const MAX_WIDTH = 1100;
const MAX_HEIGHT = 650;
const MARGIN = 6;

export default class FilesDropdownExtension extends Extension {
    enable() {
        this._window = null;
        this._windowSignals = [];
        this._spawnTimeoutId = 0;
        this._focusWasOurs = false;

        this._button = new PanelMenu.Button(0.0, this.metadata.name, true);
        this._button.add_child(new St.Icon({
            icon_name: 'folder-symbolic',
            style_class: 'system-status-icon',
        }));
        this._button.connect('button-press-event', (_actor, event) => {
            if (event.get_button() !== Clutter.BUTTON_PRIMARY)
                return Clutter.EVENT_PROPAGATE;
            this._toggle();
            return Clutter.EVENT_STOP;
        });
        this._button.connect('touch-event', (_actor, event) => {
            if (event.type() !== Clutter.EventType.TOUCH_BEGIN)
                return Clutter.EVENT_PROPAGATE;
            this._toggle();
            return Clutter.EVENT_STOP;
        });
        Main.panel.addToStatusArea(this.uuid, this._button, 0, 'right');

        this._displaySignals = [
            global.display.connect('window-created',
                (_display, win) => this._onWindowCreated(win)),
            global.display.connect('notify::focus-window',
                () => this._onFocusChanged()),
        ];
    }

    disable() {
        for (const id of this._displaySignals)
            global.display.disconnect(id);
        this._displaySignals = [];

        if (this._spawnTimeoutId) {
            GLib.source_remove(this._spawnTimeoutId);
            this._spawnTimeoutId = 0;
        }

        if (this._window)
            this._window.unmake_above();
        this._forgetWindow();

        this._button.destroy();
        this._button = null;
    }

    _toggle() {
        const win = this._window;
        if (!win) {
            this._spawn();
            return;
        }

        if (!win.minimized && this._isOurs(global.display.focus_window))
            this._close();
        else
            this._show(win);
    }

    _close() {
        const win = this._window;
        this._forgetWindow();
        win.delete(global.get_current_time());
    }

    _spawn() {
        if (this._spawnTimeoutId)
            return;

        try {
            Gio.Subprocess.new(['nautilus', '--new-window', GLib.get_home_dir()],
                Gio.SubprocessFlags.NONE);
        } catch (e) {
            console.error(`${this.uuid}: could not start nautilus: ${e}`);
            return;
        }

        this._spawnTimeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT,
            SPAWN_TIMEOUT_SECONDS, () => {
                this._spawnTimeoutId = 0;
                return GLib.SOURCE_REMOVE;
            });
    }

    _onWindowCreated(win) {
        if (!this._spawnTimeoutId || this._window)
            return;

        // On Wayland the app id is not known yet when the window is created,
        // and placing it before its first frame gets overridden by the
        // default placement, so check and adopt it on the first frame.
        const actor = win.get_compositor_private();
        if (actor) {
            const id = actor.connect('first-frame', () => {
                actor.disconnect(id);
                this._adopt(win);
            });
        } else {
            GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
                this._adopt(win);
                return GLib.SOURCE_REMOVE;
            });
        }
    }

    _adopt(win) {
        if (!this._spawnTimeoutId || this._window)
            return;
        if (win.get_window_type() !== Meta.WindowType.NORMAL)
            return;
        if (win.get_wm_class() !== NAUTILUS_WM_CLASS)
            return;

        GLib.source_remove(this._spawnTimeoutId);
        this._spawnTimeoutId = 0;

        this._window = win;
        this._windowSignals = [
            win.connect('unmanaged', () => this._forgetWindow()),
        ];
        this._show(win);
    }

    _forgetWindow() {
        if (this._window) {
            for (const id of this._windowSignals)
                this._window.disconnect(id);
        }
        this._windowSignals = [];
        this._window = null;
        this._focusWasOurs = false;
    }

    _show(win) {
        if (win !== this._window)
            return;

        const workspace = global.workspace_manager.get_active_workspace();
        if (!win.is_on_all_workspaces() && win.get_workspace() !== workspace)
            win.change_workspace(workspace);

        if (win.minimized)
            win.unminimize();
        this._place(win);
        win.make_above();
        Main.activateWindow(win);

        // A freshly opened window already has focus before we adopt it, so
        // activating it emits no focus change; record the focus ourselves.
        this._focusWasOurs = true;
    }

    _place(win) {
        const area = Main.layoutManager.getWorkAreaForMonitor(
            Main.layoutManager.primaryIndex);
        const width = Math.min(MAX_WIDTH, Math.round(area.width * 0.7));
        const height = Math.min(MAX_HEIGHT, Math.round(area.height * 0.65));

        // Center under the panel button, but keep it on screen.
        const [buttonX] = this._button.get_transformed_position();
        let x = Math.round(buttonX + this._button.width / 2 - width / 2);
        x = Math.max(area.x + MARGIN, Math.min(x, area.x + area.width - width - MARGIN));
        const y = area.y;

        if (win.get_maximized())
            win.unmaximize(Meta.MaximizeFlags.BOTH);
        win.move_resize_frame(true, x, y, width, height);
    }

    // The dropdown window itself, or a dialog that belongs to it.
    _isOurs(win) {
        for (let w = win; w; w = w.get_transient_for()) {
            if (w === this._window)
                return true;
        }
        return false;
    }

    _onFocusChanged() {
        const win = this._window;
        if (!win)
            return;

        const focusIsOurs = this._isOurs(global.display.focus_window);
        if (this._focusWasOurs && !focusIsOurs && !win.minimized) {
            this._close();
            return;
        }
        this._focusWasOurs = focusIsOurs;
    }
}
