'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

const hero = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-shrink-0">
        <motion.h1
          className="mt-10 text-4xl font-bold sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Plate Pilot
        </motion.h1>
        <motion.p
          className="mt-6 text-lg leading-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Turn What You Have into What You Crave!
        </motion.p>
        <motion.div
          className="mt-10 flex items-center gap-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/generate" className="apple-button">
            Create Recipe
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#how-it-works')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
            className="text-sm font-semibold leading-6"
          >
            Learn how <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        className="mx-auto mt-16 lg:mt-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Image
          src="/images/plate.png"
          alt="plate"
          width={500}
          height={500}
          priority
        />
      </motion.div>
    </div>
  );
};

export default hero;
