"use client"

import { useState } from "react"
import { Menu, X } from 'lucide-react'
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()


  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Generate Recipes', href: '/generate' },
    { name: 'Saved Recipes', href: '/saved' },
    { name: 'Login', href: '/login'}
  ]


  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b ${isOpen ? "bg-white" : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"}`}      
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between h-16">
          <div>
            <Link href="/" className="text-xl font-bold">
              PlatePilot
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map((nav) => (
              <Link 
                href={nav.href}
                key={nav.name}
                className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium" 
              >
                  {nav.name}
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            <button className="md:hidden transition-transform duration-300 hover:scale-110" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}

            </button>

          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden absolute top-full left-0 right-0 ${theme === "light" ? "bg-white" : "bg-white"} shadow-md overflow-hidden py-4`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
                {navItems.map((nav) => (
                  <Link 
                    href={nav.href}
                    key={nav.name}
                  >
                      {nav.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )

          }
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}


