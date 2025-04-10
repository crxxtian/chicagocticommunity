import { motion } from "framer-motion";

const DiscussionsComingSoon = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-mono font-bold mb-4"
      >
        Discussions Coming Soon
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-muted-foreground mb-6 text-sm"
      >
        We’re building a community space for Chicago-area cybersecurity professionals.
        Sign up below to get notified when it launches.
      </motion.p>

      <motion.form
        action="https://formspree.io/f/mgvarprq"
        method="POST"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full sm:w-auto px-4 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition"
        >
          Notify Me
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-left text-sm text-muted-foreground max-w-md mx-auto"
      >
        <h2 className="font-bold text-foreground mb-2">What’s coming:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Topic-based discussion boards</li>
          <li>Local threat intel exchange threads</li>
          <li>Monthly meetup planning + recaps</li>
          <li>Job board for Chicago cybersecurity roles</li>
          <li>Vendor + tooling recommendations</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default DiscussionsComingSoon;
