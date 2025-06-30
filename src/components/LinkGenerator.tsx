import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Link, Copy, Download, Plus, Code, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { createLink, fetchLinks, fetchLinkById } from '@/lib/api';
=======
import { createLink, fetchLinks, deleteLink } from '@/lib/api';
>>>>>>> 4315644b235e71244efeeb5d23ae7976bf223df3

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load existing links from API
  React.useEffect(() => {
    console.log('LinkGenerator: Component mounted, loading feedback links...');
    console.log('LinkGenerator: Current API_URL from env:', import.meta.env.VITE_API_URL);
    fetchLinks()
      .then(links => {
        console.log('LinkGenerator: Successfully loaded links:', links);
        setGeneratedLinks(links);
      })
      .catch(error => {
        console.error('LinkGenerator: Error loading links:', error);
        setGeneratedLinks([]);
        toast({
          title: "Fehler beim Laden",
          description: `Konnte Links nicht laden: ${error.message}`,
          variant: "destructive",
        });
      });
  }, []);

  const generateQRCode = (url: string): string => {
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
    
    console.log('LinkGenerator: handleGenerate called with:', { customerNumber, concern, firstName, lastName });
    
    if (!customerNumber || !concern || !firstName || !lastName) {
      console.log('LinkGenerator: Validation failed - missing fields');
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
<<<<<<< HEAD
      const baseUrl = window.location.origin;
      // Backend erzeugt jetzt die ID und gibt sie zurück
=======
      console.log('LinkGenerator: Creating link with data:', { customerNumber, concern, firstName, lastName });
      
>>>>>>> 4315644b235e71244efeeb5d23ae7976bf223df3
      const newLink = await createLink({
        customerNumber,
        concern,
        firstName,
        lastName
      });
<<<<<<< HEAD
      // Feedback-Link und QR-Code-URL lokal generieren
      const feedbackUrl = `${baseUrl}/?ref=${newLink.id}`;
      const qrCodeUrl = generateQRCode(feedbackUrl);
      // Links-Liste aktualisieren (mit lokal generierten URLs)
      const links = await fetchLinks();
      setGeneratedLinks(links.map(link => ({
        ...link,
        feedbackUrl: `${baseUrl}/?ref=${link.id}`,
        qrCodeUrl: generateQRCode(`${baseUrl}/?ref=${link.id}`)
      })));
=======
      
      console.log('LinkGenerator: Successfully created link:', newLink);
      
      // Reload all links to get the updated list
      console.log('LinkGenerator: Reloading all links...');
      const links = await fetchLinks();
      console.log('LinkGenerator: Reloaded links:', links);
      setGeneratedLinks(links);
      
      // Clear form
>>>>>>> 4315644b235e71244efeeb5d23ae7976bf223df3
      setCustomerNumber('');
      setConcern('');
      setFirstName('');
      setLastName('');
      
      toast({
        title: "Link generiert",
        description: "Feedback-Link und QR-Code wurden erfolgreich erstellt.",
      });
    } catch (error) {
      console.error('LinkGenerator: Error creating link:', error);
      toast({
        title: "Fehler",
        description: `Beim Generieren des Links ist ein Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) {
      console.log('LinkGenerator: Delete already in progress, ignoring request');
      return; // Prevent multiple simultaneous deletions
    }
    
    console.log('LinkGenerator: handleDelete called with id:', id);
    setDeletingId(id);
    
    try {
      console.log('LinkGenerator: Deleting link with id:', id);
      await deleteLink(id);
      console.log('LinkGenerator: Successfully deleted link:', id);
      
      // Reload links after successful deletion
      console.log('LinkGenerator: Reloading links after deletion...');
      const links = await fetchLinks();
      console.log('LinkGenerator: Reloaded links after deletion:', links);
      setGeneratedLinks(links);
      
      toast({
        title: "Link gelöscht",
        description: "Der Feedback-Link wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error('LinkGenerator: Error deleting link:', error);
      toast({
        title: "Fehler beim Löschen",
        description: error instanceof Error ? error.message : "Beim Löschen des Links ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Kopiert",
          description: "Link wurde in die Zwischenablage kopiert.",
        });
      }).catch(() => {
        toast({
          title: "Fehler",
          description: "Kopieren in die Zwischenablage nicht möglich.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback für unsichere Kontexte
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast({
          title: "Kopiert",
          description: "Link wurde in die Zwischenablage kopiert.",
        });
      } catch {
        toast({
          title: "Fehler",
          description: "Kopieren in die Zwischenablage nicht möglich.",
          variant: "destructive",
        });
      }
    }
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Diesen Link wirklich löschen?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/feedback-links/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Fehler beim Löschen');
      setGeneratedLinks(generatedLinks.filter(link => link.id !== id));
      toast({ title: 'Gelöscht', description: 'Link wurde gelöscht.' });
    } catch {
      toast({ title: 'Fehler', description: 'Link konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-sm text-yellow-800">
            <strong>Debug Info:</strong> API URL = {import.meta.env.VITE_API_URL || '/api'} | 
            Links geladen: {generatedLinks.length} | 
            Browser URL: {window.location.origin}
          </p>
        </CardContent>
      </Card>

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        disabled={deletingId === link.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === link.id ? 'Lösche...' : 'Löschen'}
                      </Button>
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
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(link.id)}
                  >
                    Löschen
                  </Button>
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
