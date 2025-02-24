export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={` text-white min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}
    >
      {children}
    </div>
  );
}
