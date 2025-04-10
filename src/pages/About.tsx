
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-mono font-bold mb-4">About CCTIC</h1>
        <p className="text-muted-foreground">
          Learn about our mission and how you can get involved.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-mono font-medium mb-4">Our Mission</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Chicago Cyber Threat Intelligence Community (CCTIC) was founded in 2023 by a group of cybersecurity professionals dedicated to improving the security posture of organizations throughout the Chicagoland area.
            </p>
            <p>
              Our mission is to facilitate the sharing of actionable threat intelligence, best practices, and security resources among organizations of all sizes in Chicago and the surrounding suburbs. We believe that a collaborative approach to cybersecurity benefits the entire community and helps build resilience against evolving threats.
            </p>
            <p>
              Through our platform, we aim to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide timely and relevant cybersecurity news and alerts specific to our region</li>
              <li>Facilitate the sharing of threat intelligence in an accessible format</li>
              <li>Create opportunities for security professionals to network and collaborate</li>
              <li>Support smaller organizations that may have limited security resources</li>
              <li>Strengthen the overall cybersecurity ecosystem in the Chicago metropolitan area</li>
            </ul>
          </div>

          <h2 className="text-xl font-mono font-medium mt-8 mb-4">Get Involved</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              CCTIC welcomes participation from all cybersecurity professionals, IT specialists, and organizations in the Chicago area. Here's how you can get involved:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Contribute to discussions on our forums</li>
              <li>Share threat intelligence you've encountered in your organization</li>
              <li>Submit mini-reports on security trends or incidents</li>
              <li>Attend our monthly virtual meetups and quarterly in-person events</li>
              <li>Volunteer to help maintain and grow our resource library</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-mono font-medium mb-4">Contact Us</h2>
          <p className="mb-6 text-muted-foreground">
            Have questions, suggestions, or interested in contributing to CCTIC? Send us a message using the form below.
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

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
