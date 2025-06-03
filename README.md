## Başlamadan Önce

Öncelikle, bilgisayarında şunların yüklü olması gerekiyor:

- [Node.js](https://nodejs.org/) (Tercihen LTS versiyonu)
- [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)
- Telefonunda [Expo Go](https://expo.dev/client) uygulaması (iOS veya Android)

## Kurulum

1. Öncelikle projeyi bilgisayarına al

```bash
git clone <repository-url>
cd Terra
```

2. Gerekli paketleri yükle

```bash
npm install
# veya yarn kullanıyorsan
yarn install
```

## Uygulamayı Çalıştırma

### Geliştirme Sunucusunu Başlatma

Uygulamayı geliştirme modunda başlatmak için:

```bash
npm start
# veya
yarn start
# veya
npx expo start
```

Bu komut Expo geliştirme sunucusunu başlatacak ve terminal ekranında bir QR kod gösterecek.

### Expo Go ile Kullanma

Uygulamayı telefonunda çalıştırmak için:

1. Önce telefonuna Expo Go uygulamasını indir: [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779) veya [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Telefonunun bilgisayarın ile aynı Wi-Fi ağına bağlı olduğundan emin ol

3. Android için: Expo Go uygulamasını aç ve terminalde gördüğün QR kodu tara

   iOS için: Telefonunun kamera uygulamasıyla QR kodu tara

4. Uygulama telefonunda yüklenip çalışacak

### Farklı Platformlarda Çalıştırma

İstersen uygulamayı belirli platformlar için de başlatabilirsin:

```bash
# Android için
npm run android
# veya
yarn android

# iOS için
npm run ios
# veya
yarn ios

# Web için
npm run web
# veya
yarn web
```

## Proje Yapısı

Projemiz Expo Router dosya tabanlı yönlendirme sistemini kullanıyor:

- `src/app/` - Tüm ekranlar ve navigasyon
  - `(auth)/` - Giriş, kayıt gibi kimlik doğrulama ekranları
  - `(protected)/` - Sadece giriş yapmış kullanıcıların erişebileceği ekranlar
    - `(tabs)/` - Ana sekme navigasyon ekranları
- `src/components/` - Yeniden kullanılabilir UI bileşenleri
- `src/constants/` - Renkler gibi global sabitler
- `src/lib/` - Kütüphaneler ve API bağlantıları (Supabase)
- `src/providers/` - Context sağlayıcıları
- `src/types/` - TypeScript tip tanımlamaları
