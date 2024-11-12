const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-4">GiftWhisperer</h3>
            <p className="text-gray-600">
              AI-powered gift recommendations for every special occasion.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-primary">Home</a></li>
              <li><a href="/how-it-works" className="text-gray-600 hover:text-primary">How It Works</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-primary">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} GiftWhisperer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;