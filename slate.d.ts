import 'slate';

declare module 'slate' {
  interface CustomTypes {
    Element: { type: string; [key: string]: any; children: CustomTypes['Text'][] };
    Text: { text: string; bold?: boolean; italic?: boolean; underline?: boolean };
  }
}
