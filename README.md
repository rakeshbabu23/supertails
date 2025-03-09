# React Native Project Setup

## Prerequisites
- Ensure you have Node.js installed.
- Install React Native CLI globally:
  ```sh
  npm install -g react-native-cli
  ```
- Install dependencies:
  ```sh
  npm install
  ```

## Environment Variables
- Create a `.env` file in the root directory.
- Add your Google Maps API Key:
  ```sh
  GOOGLE_API_KEY=your_api_key_here
  ```

## Android Setup
1. Open `android/app/src/main/AndroidManifest.xml`.
2. Replace the Google Maps API Key:
   ```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="${GOOGLE_MAPS_API_KEY}"/>
   ```
3. Run the project on Android:
   ```sh
   npx react-native run-android
   ```

## iOS Setup
1. Install CocoaPods dependencies:
   ```sh
   cd ios
   pod install
   cd ..
   ```
2. Run the project on iOS:
   ```sh
   npx react-native run-ios
   ```

## Documentation
For more details, refer to the project documentation:  
[Project Documentation](https://docs.google.com/document/d/1OZEhFBPs1km2d5tvHS5Litg_SYhzZRU5BAiS9E68Zfs/edit?usp=sharing)
