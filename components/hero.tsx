"use client"
import React from 'react'
import Image from "next/image"
import Link from "next/link"

import { motion } from 'framer-motion'


const hero = () => {
  return (
    <div className='mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:mx-0 lg:flex-shrink-0'>
            <motion.h1 
              className='mt-10 text-4xl font-bold sm:text-6xl'
            >
                Plate Pilot
            </motion.h1>
            <motion.p 
              className='mt-6 text-lg leading-8'
            >
              Turn What You Have into What You Crave!
            </motion.p>
            <div className='mt-10 flex items-center gap-x-6'>
              <Link href='/about' className='apple-button'> Create Recipe</Link>
              <a href="#" className='text-sm font-semibold leading-6'>Learn how <span aria-hidden="true">→</span></a>
              
              
            </div>

        </div>

        <div className='mx-auto'>
            <Image 
              src="/images/plate.png"
              alt="plate"
              width={500}
              height={500}
              priority
            />
        </div>

    </div>
  )
}

export default hero