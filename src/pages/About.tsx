import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("https://formspree.io/f/mgvarrpn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    setLoading(false);

    if (response.ok) {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-mono font-bold mb-4">About CCTIC</h1>
        <p className="text-muted-foreground">
          Learn about the purpose behind this project and how you can be part of it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-mono font-medium mb-4">The Mission</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Chicago Cyber Threat Intelligence Community (CCTIC) is an independent project run by a cybersecurity analyst based in Chicago. It’s built with the goal of making threat intelligence and security insights more accessible to professionals, small organizations, and the broader public in the Chicagoland area.
            </p>
            <p>
              While this platform is maintained by one person, the vision is collaborative. CCTIC is here to elevate local cybersecurity efforts by:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Highlighting regional cybersecurity news and incidents</li>
              <li>Publishing brief, informative mini-reports and alerts</li>
              <li>Curating valuable resources for professionals and organizations</li>
              <li>Supporting smaller orgs that lack dedicated security teams</li>
              <li>Creating a space for knowledge-sharing and discussion</li>
            </ul>
          </div>

          <h2 className="text-xl font-mono font-medium mt-8 mb-4">Looking to Collaborate</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              If you're a fellow security analyst, researcher, student, or just someone passionate about cybersecurity in the Chicago area — I’d love to hear from you. Collaboration is open.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Want to contribute a mini-report or blog post?</li>
              <li>Interested in running a discussion or event?</li>
              <li>Have threat intelligence or news to share?</li>
              <li>Have ideas to improve this platform?</li>
            </ul>
            <p>
              Let’s make something useful together.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-mono font-medium mb-4">Contact</h2>
          <p className="mb-6 text-muted-foreground">
            Got questions or want to get involved? Send a message directly using this form:
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
