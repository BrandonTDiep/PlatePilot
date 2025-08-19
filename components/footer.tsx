export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 mx-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Brandon Diep. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
