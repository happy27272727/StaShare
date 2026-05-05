import { C } from "@/constants/Colors";

export default function Rott({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      <body>{children}</body>
    </html>
  );
}
const responsiveBackground = `
body {
background-color: ${C.background}
}
`;
