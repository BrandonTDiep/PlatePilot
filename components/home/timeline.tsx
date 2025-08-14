'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';

const recipeSteps = [
  {
    number: '1',
    title: 'Create an Account',
    description: 'Login with your credentials and begin saving recipes.',
  },
  {
    number: '2',
    title: 'Enter Ingredients',
    description:
      'Type in your ingredients and receive recipes containing those.',
  },
  {
    number: '3',
    title: 'Generate Recipes',
    description: 'View the generated recipes based on your ingredients.',
  },
  {
    number: '4',
    title: 'Save Recipe',
    description: 'Save the recipe to your account.',
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative py-20 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Recipes generated for your ingredients.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"
            style={{ scaleY: scaleX }}
          />

          {recipeSteps.map((step, index) => (
            <RecipeSteps key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const RecipeSteps = ({
  step,
  index,
}: {
  step: (typeof recipeSteps)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="w-5/12" />
      <div className="z-20">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <div className="w-3 h-3 bg-background rounded-full" />
        </div>
      </div>
      <motion.div
        className="w-5/12 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="p-4 bg-background rounded-lg shadow-md border border-primary/10">
          <span className="font-bold text-primary">Step {step.number}</span>
          <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
