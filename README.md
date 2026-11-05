# Files Dropdown

A GNOME Shell extension that puts a folder icon in the top bar. Click it and a
small Files (Nautilus) window drops down right under the bar, on top of
everything else. Click anywhere outside it and it closes.

It is made for one job: getting a file into the app you are already using
without shuffling windows around. Want to upload a file to a website? Click the
folder icon, drag the file onto the browser behind it, done. No minimizing the
browser, opening Files, and tiling the two side by side first.

[Türkçe açıklama aşağıda](#türkçe)

## How it works

- **Click the folder icon** → a Files window opens under the top bar, starting in
  your home folder, and stays above other windows.
- **Drag a file** from it onto any window behind it (a browser upload area, a
  chat app, an editor…).
- **Click any other window, the desktop or the top bar**, or click the folder
  icon again → the Files window closes.
- Dialogs that belong to that window (Rename, Properties, …) do not close it.

It uses a real Nautilus window rather than a menu in the top bar, because GNOME
does not allow dragging files out of the top bar menus into other apps.

## Requirements

- GNOME Shell 48 (tested on Debian 13 "Trixie", Wayland session)
- Nautilus (GNOME Files)

## Installation

1. Clone the repository straight into your extensions folder:

   ```bash
   git clone https://github.com/FredJones35/gnome-files-dropdown.git ~/.local/share/gnome-shell/extensions/files-dropdown@fredjones35.github.io
   ```

2. Log out and log back in. On Wayland, GNOME Shell only picks up new
   extensions at login. (On X11 you can press <kbd>Alt</kbd>+<kbd>F2</kbd>, type
   `r` and press <kbd>Enter</kbd> instead.)

3. Enable the extension:

   ```bash
   gnome-extensions enable files-dropdown@fredjones35.github.io
   ```

   You can also turn it on from the **Extensions** app.

The folder icon appears on the right side of the top bar, next to the system
icons.

### Updating

```bash
git -C ~/.local/share/gnome-shell/extensions/files-dropdown@fredjones35.github.io pull
```

Then log out and back in.

### Uninstalling

```bash
gnome-extensions uninstall files-dropdown@fredjones35.github.io
```

## Known limitations

- Each time it opens, it starts again in your home folder.
- Only GNOME Shell 48 is tested and listed in `metadata.json`.

## Troubleshooting

If the icon does not show up or nothing happens on click, check the GNOME Shell
log:

```bash
journalctl --user -b -o cat | grep -i files-dropdown
```

## License

GPL-2.0-or-later. See [LICENSE](LICENSE).

---

## Türkçe

Üst çubuğa bir klasör simgesi ekleyen bir GNOME Shell eklentisi. Simgeye
basınca çubuğun hemen altında, diğer pencerelerin üstünde küçük bir Dosyalar
(Nautilus) penceresi açılır. Dışına tıklayınca kapanır.

Tek bir iş için yapıldı: Kullandığınız uygulamaya pencereleri oradan oraya
taşımadan dosya aktarmak. Bir siteye dosya mı yükleyeceksiniz? Klasör simgesine
basın, dosyayı arkadaki tarayıcıya sürükleyin, bu kadar. Önce tarayıcıyı
küçültmenize, Dosyalar'ı açmanıza, iki pencereyi yan yana dizmenize gerek yok.

### Nasıl çalışır

- **Klasör simgesine basın** → üst çubuğun altında, ev klasörünüzde başlayan ve
  diğer pencerelerin üstünde duran bir Dosyalar penceresi açılır.
- **Dosyayı sürükleyin** ve arkadaki herhangi bir pencereye bırakın (tarayıcıdaki
  yükleme alanı, mesajlaşma uygulaması, düzenleyici…).
- **Başka bir pencereye, masaüstüne ya da üst çubuğa tıklayın** veya klasör
  simgesine tekrar basın → Dosyalar penceresi kapanır.
- Bu pencereye ait iletişim kutuları (Yeniden Adlandır, Özellikler, …) açıkken
  pencere kapanmaz.

Üst çubukta bir menü yerine gerçek bir Nautilus penceresi kullanılıyor, çünkü
GNOME üst çubuk menülerinden başka uygulamalara dosya sürüklemeye izin vermiyor.

### Gereksinimler

- GNOME Shell 48 (Debian 13 "Trixie", Wayland oturumunda denendi)
- Nautilus (GNOME Dosyalar)

### Kurulum

1. Depoyu doğrudan eklentiler klasörünüze klonlayın:

   ```bash
   git clone https://github.com/FredJones35/gnome-files-dropdown.git ~/.local/share/gnome-shell/extensions/files-dropdown@fredjones35.github.io
   ```

2. Oturumu kapatıp yeniden açın. Wayland'da GNOME Shell yeni eklentileri
   yalnızca oturum açılırken tanır. (X11 kullanıyorsanız bunun yerine
   <kbd>Alt</kbd>+<kbd>F2</kbd>'ye basıp `r` yazıp <kbd>Enter</kbd>'a
   basabilirsiniz.)

3. Eklentiyi etkinleştirin:

   ```bash
   gnome-extensions enable files-dropdown@fredjones35.github.io
   ```

   **Eklentiler** uygulamasından da açabilirsiniz.

Klasör simgesi üst çubuğun sağında, sistem simgelerinin yanında görünür.

### Güncelleme

```bash
git -C ~/.local/share/gnome-shell/extensions/files-dropdown@fredjones35.github.io pull
```

Ardından oturumu kapatıp yeniden açın.

### Kaldırma

```bash
gnome-extensions uninstall files-dropdown@fredjones35.github.io
```

### Bilinen sınırlamalar

- Her açılışta ev klasörünüzden başlar.
- Yalnızca GNOME Shell 48'de denendi ve `metadata.json` dosyasında yalnızca bu
  sürüm listelenmiştir.

### Sorun giderme

Simge görünmüyorsa ya da basınca bir şey olmuyorsa GNOME Shell kaydına bakın:

```bash
journalctl --user -b -o cat | grep -i files-dropdown
```

### Lisans

GPL-2.0-or-later. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
