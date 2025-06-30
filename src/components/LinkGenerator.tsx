import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Link, Copy, Download, Plus, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createLink, fetchLinks } from '@/lib/api';

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
  const [showApiDocs, setShowApiDocs] = useState(false);

  // Load existing links from localStorage
  React.useEffect(() => {
    fetchLinks()
      .then(setGeneratedLinks)
      .catch(() => setGeneratedLinks([]));
  }, []);

  const generateQRCode = (url: string): string => {
    // In a real implementation, you would use a QR code library
    // For now, we'll use a placeholder QR code service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const getConcernText = (concern: string): string => {
    const concernTexts: Record<string, string> = {
      'Internet-Freischaltung': 'Kürzlich wurde Ihr Internet freigeschaltet. Wie war Ihre Erfahrung mit unserem Service?',
      'Störung': 'Wir haben Ihre gemeldete Störung bearbeitet. Wie zufrieden sind Sie mit der Lösung?',
      'Servicebesuch': 'Unser Techniker war bei Ihnen vor Ort. Wie bewerten Sie den Servicebesuch?',
      'Beratung': 'Sie haben eine Beratung bei uns erhalten. Wie hilfreich war unser Beratungsgespräch?',
      'Rechnung': 'Bezüglich Ihrer Rechnungsanfrage: Wie zufrieden sind Sie mit der Bearbeitung?',
      'Kündigung': 'Ihre Kündigung wurde bearbeitet. Wie bewerten Sie unseren Kündigungsprozess?',
      'Sonstiges': 'Wie war Ihre Erfahrung mit unserem Service?'
    };
    return concernTexts[concern] || 'Wie war Ihre Erfahrung mit unserem Service?';
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
      const baseUrl = window.location.origin;
      const concernText = getConcernText(concern);
      const feedbackUrl = `${baseUrl}/?customer=${encodeURIComponent(customerNumber)}&name=${encodeURIComponent(`${firstName} ${lastName}`)}&concern=${encodeURIComponent(concern)}&text=${encodeURIComponent(concernText)}`;
      const qrCodeUrl = generateQRCode(feedbackUrl);
      const newLink = await createLink({
        customerNumber,
        concern,
        firstName,
        lastName,
        feedbackUrl,
        qrCodeUrl
      });
      const links = await fetchLinks();
      setGeneratedLinks(links);
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
      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API-Dokumentation für n8n Integration
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiDocs(!showApiDocs)}
            >
              {showApiDocs ? 'Ausblenden' : 'Anzeigen'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showApiDocs && (
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">POST /api/feedback-links</h4>
              <p className="text-sm text-gray-600 mb-2">Erstellt einen neuen Feedback-Link</p>
              <div className="bg-white p-3 rounded border">
                <pre className="text-xs overflow-x-auto">
{`{
  "customerNumber": "K-12345",
  "firstName": "Max",
  "lastName": "Mustermann",
  "concern": "Internet-Freischaltung"
}`}
                </pre>
              </div>
              <p className="text-sm text-gray-600 mt-2 mb-2">Response:</p>
              <div className="bg-white p-3 rounded border">
                <pre className="text-xs overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": "1703123456789abc123",
    "feedbackUrl": "https://yourdomain.com/?ref=...",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/...",
    "concernText": "Kürzlich wurde Ihr Internet freigeschaltet...",
    "createdAt": "2024-06-30T10:00:00.000Z"
  }
}`}
                </pre>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">GET /api/feedback-links/:id</h4>
              <p className="text-sm text-gray-600 mb-2">Ruft Details eines Feedback-Links ab</p>
              <div className="bg-white p-3 rounded border">
                <pre className="text-xs overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": "1703123456789abc123",
    "customerNumber": "K-12345",
    "firstName": "Max",
    "lastName": "Mustermann",
    "concern": "Internet-Freischaltung",
    "feedbackUrl": "https://yourdomain.com/?ref=...",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/...",
    "used": false,
    "createdAt": "2024-06-30T10:00:00.000Z"
  }
}`}
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">n8n Workflow Beispiel</h4>
              <p className="text-sm text-gray-600 mb-2">1. HTTP Request Node konfigurieren:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Method: POST</li>
                <li>URL: https://ihre-domain.com/api/feedback-links</li>
                <li>Headers: Content-Type: application/json</li>
                <li>Body: JSON mit customerNumber, firstName, lastName, concern</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">2. Response enthält feedbackUrl und qrCodeUrl für E-Mail-Versand</p>
            </div>
          </CardContent>
        )}
      </Card>

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

            {/* Preview des Bewertungstexts */}
            {concern && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-blue-900">Vorschau Bewertungstext:</Label>
                <p className="text-sm text-blue-800 mt-1">{getConcernText(concern)}</p>
              </div>
            )}
            
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
                      <p className="text-xs text-blue-600 mt-1">
                        Text: {getConcernText(link.concern)}
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
