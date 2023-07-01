export function parseText(subject: any) {
   return JSON.parse(subject.text()) as Record<string, any>
}
