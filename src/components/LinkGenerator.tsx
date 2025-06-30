
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Link, Copy, Download, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FeedbackLink {
  id: string;
  customerNumber: string;
  concern: string;
  firstName: string;
  lastName: string;
  feedbackUrl: string;
  qrCodeUrl: string;
  createdAt: string;
  used: boolean;
}

const LinkGenerator = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [concern, setConcern] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<FeedbackLink[]>([]);

  // Load existing links from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('feedbackLinks');
    if (stored) {
      setGeneratedLinks(JSON.parse(stored));
    }
  }, []);

  const generateQRCode = (url: string): string => {
    // In a real implementation, you would use a QR code library
    // For now, we'll use a placeholder QR code service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerNumber || !concern || !firstName || !lastName) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate unique ID
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Create feedback URL with parameters
      const baseUrl = window.location.origin;
      const feedbackUrl = `${baseUrl}/?ref=${id}&customer=${encodeURIComponent(customerNumber)}&name=${encodeURIComponent(`${firstName} ${lastName}`)}&concern=${encodeURIComponent(concern)}`;
      
      // Generate QR code URL
      const qrCodeUrl = generateQRCode(feedbackUrl);

      const newLink: FeedbackLink = {
        id,
        customerNumber,
        concern,
        firstName,
        lastName,
        feedbackUrl,
        qrCodeUrl,
        createdAt: new Date().toISOString(),
        used: false
      };

      const updatedLinks = [...generatedLinks, newLink];
      setGeneratedLinks(updatedLinks);
      localStorage.setItem('feedbackLinks', JSON.stringify(updatedLinks));

      // Reset form
      setCustomerNumber('');
      setConcern('');
      setFirstName('');
      setLastName('');

      toast({
        title: "Link generiert",
        description: "Feedback-Link und QR-Code wurden erfolgreich erstellt.",
      });

    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Generieren des Links ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: "Link wurde in die Zwischenablage kopiert.",
    });
  };

  const downloadQRCode = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code-${filename}.png`;
    link.click();
  };

  const concernOptions = [
    'Internet-Freischaltung',
    'Störung',
    'Servicebesuch',
    'Beratung',
    'Rechnung',
    'Kündigung',
    'Sonstiges'
  ];

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Neuen Feedback-Link generieren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Kundennummer *</Label>
                <Input
                  id="customerNumber"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="z.B. K-12345"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="concern">Anliegen *</Label>
                <Select value={concern} onValueChange={setConcern} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Anliegen auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {concernOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Max"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mustermann"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full md:w-auto"
            >
              {isGenerating ? 'Generiere...' : 'Link & QR-Code generieren'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Links */}
      {generatedLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generierte Links ({generatedLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedLinks.map((link) => (
                <div key={link.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {link.firstName} {link.lastName} - {link.customerNumber}
                      </h4>
                      <p className="text-sm text-gray-600">{link.concern}</p>
                      <p className="text-xs text-gray-500">
                        Erstellt: {new Date(link.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        link.used ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {link.used ? 'Verwendet' : 'Offen'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Feedback-Link</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={link.feedbackUrl} 
                          readOnly 
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.feedbackUrl)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">QR-Code</Label>
                      <div className="flex items-center gap-2">
                        <img 
                          src={link.qrCodeUrl} 
                          alt="QR Code" 
                          className="w-12 h-12 border rounded"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadQRCode(link.qrCodeUrl, `${link.customerNumber}-${link.id}`)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkGenerator;
