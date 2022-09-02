# Google Fit Sample App

## 準備

- https://developers.google.com/fit/android/get-api-key

注意点

- xxxxx\debug.keystoreの場所はproject root/android/app/debug.keystoreを指定すること。

  ```
  keytool -list -v -keystore "xxxxx\debug.keystore" -alias androiddebugkey -storepass android -keypass android
  ```

- 認証情報のキーはSHA-1を間違えずに指定すること。
- 認証情報の登録画面でクライアントIDが取得できるが設定では特に利用しない。
- 同意画面も作成する必要がある。内容は適当でよい

## 実行

  ```
  npx react-native run-android
  ```

## 解除

- GoogleFitにリンクされたアプリケーションはGoogleFit→プロフィール→設定アイコンから削除することが可能です。
- 一度リンクが解除されると、アプリで再度認証画面が表示されるようになります。
