import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-lg">{question}</span>
        {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  const faqs = [
    {
      question: "How do you ship the plants?",
      answer: "We use specially designed packaging that secures the pot and protects the foliage. Each plant is watered before shipping and wrapped in protective materials to ensure it stays hydrated and safe during transit."
    },
    {
      question: "What if my plant arrives damaged?",
      answer: "We have a 100% happiness guarantee. If your plant arrives damaged or unhealthy, please send us photos within 24 hours of delivery, and we will send a replacement or issue a refund."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within India. We are hoping to expand our shipping capabilities in the future."
    },
    {
      question: "How do I know which plant is right for me?",
      answer: "You can use our filters on the Shop page to find plants based on your light conditions, care level, and pet-friendliness. If you're a beginner, we recommend starting with our 'Easy Care' collection."
    },
    {
      question: "Are the pots included?",
      answer: "Most of our plants come in a standard nursery pot. Decorative pots are sold separately unless specified in the product description."
    },
    {
      question: "Can I cancel or change my order?",
      answer: "If you need to make changes, please contact us within 2 hours of placing your order. Once the order has been processed for shipping, we cannot make changes."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our plants, shipping, and care.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a href="/contact" className="text-primary font-semibold hover:underline">
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
