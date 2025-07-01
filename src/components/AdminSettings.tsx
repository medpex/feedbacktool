
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Key, 
  Globe, 
  MessageSquare, 
  Tag,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchSettings, saveSettings, saveAdminCredentials } from '@/lib/api';

interface AdminCredentials {
  username: string;
  password: string;
}

interface DomainSetting {
  id: string;
  domain: string;
  isActive: boolean;
}

interface ConcernText {
  concern: string;
  text: string;
}

interface ConcernType {
  id: string;
  name: string;
  isActive: boolean;
}

const AdminSettings = () => {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: 'admin',
    password: ''
  });
  const [domains, setDomains] = useState<string[]>(['https://feedback.home-ki.eu']);
  const [concernTexts, setConcernTexts] = useState<Record<string, string>>({
    'Internet-Freischaltung': 'Kürzlich wurde Ihr Internet freigeschaltet. Wie war Ihre Erfahrung mit unserem Service?',
    'Störung': 'Wir haben Ihre gemeldete Störung bearbeitet. Wie zufrieden sind Sie mit der Lösung?',
    'Servicebesuch': 'Unser Techniker war bei Ihnen vor Ort. Wie bewerten Sie den Servicebesuch?',
    'Beratung': 'Sie haben eine Beratung bei uns erhalten. Wie hilfreich war unser Beratungsgespräch?',
    'Rechnung': 'Bezüglich Ihrer Rechnungsanfrage: Wie zufrieden sind Sie mit der Bearbeitung?',
    'Kündigung': 'Ihre Kündigung wurde bearbeitet. Wie bewerten Sie unseren Kündigungsprozess?',
    'Sonstiges': 'Wie war Ihre Erfahrung mit unserem Service?'
  });
  const [concernTypes, setConcernTypes] = useState<string[]>([
    'Internet-Freischaltung',
    'Störung', 
    'Servicebesuch',
    'Beratung',
    'Rechnung',
    'Kündigung',
    'Sonstiges'
  ]);
  
  const [newDomain, setNewDomain] = useState('');
  const [newConcernType, setNewConcernType] = useState('');
  const [loading, setLoading] = useState(false);

  // Einstellungen beim Laden abrufen
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        console.log('Loaded settings:', settings);
        if (settings.domains) {
          setDomains(settings.domains);
        }
        if (settings.concern_texts) {
          setConcernTexts(settings.concern_texts);
        }
        if (settings.concern_types) {
          setConcernTypes(settings.concern_types);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Fehler beim Laden der Einstellungen');
      }
    };
    loadSettings();
  }, []);

  // Zugangsdaten speichern
  const handleSaveCredentials = async () => {
    if (!credentials.password.trim()) {
      toast.error('Bitte geben Sie ein Passwort ein');
      return;
    }

    setLoading(true);
    try {
      await saveAdminCredentials(credentials);
      toast.success('Zugangsdaten erfolgreich aktualisiert');
      setCredentials({ ...credentials, password: '' });
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast.error('Fehler beim Speichern der Zugangsdaten');
    } finally {
      setLoading(false);
    }
  };

  // Domain hinzufügen
  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    
    const updatedDomains = [...domains, newDomain.trim()];
    setDomains(updatedDomains);
    setNewDomain('');
    toast.success('Domain hinzugefügt');
  };

  // Domain löschen
  const handleDeleteDomain = (domainToDelete: string) => {
    const updatedDomains = domains.filter(d => d !== domainToDelete);
    setDomains(updatedDomains);
    toast.success('Domain entfernt');
  };

  // Anliegen-Text aktualisieren
  const handleUpdateConcernText = (concern: string, text: string) => {
    setConcernTexts({ ...concernTexts, [concern]: text });
  };

  // Neues Anliegen hinzufügen
  const handleAddConcernType = () => {
    if (!newConcernType.trim()) return;
    
    const updatedTypes = [...concernTypes, newConcernType.trim()];
    setConcernTypes(updatedTypes);
    
    // Auch einen Standard-Text hinzufügen
    setConcernTexts({
      ...concernTexts,
      [newConcernType.trim()]: 'Wie war Ihre Erfahrung mit unserem Service?'
    });
    
    setNewConcernType('');
    toast.success('Anliegen hinzugefügt');
  };

  // Anliegen löschen
  const handleDeleteConcernType = (concernToDelete: string) => {
    const updatedTypes = concernTypes.filter(ct => ct !== concernToDelete);
    setConcernTypes(updatedTypes);
    
    const updatedTexts = { ...concernTexts };
    delete updatedTexts[concernToDelete];
    setConcernTexts(updatedTexts);
    
    toast.success('Anliegen entfernt');
  };

  // Alle Einstellungen speichern
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await saveSettings({
        domains,
        concern_texts: concernTexts,
        concern_types: concernTypes
      });
      toast.success('Einstellungen erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Fehler beim Speichern der Einstellungen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin-Einstellungen</h1>
            <p className="text-gray-600 mt-1">Konfiguration des Systems</p>
          </div>
        </div>

        <Tabs defaultValue="credentials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="credentials" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Zugangsdaten
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Domains
            </TabsTrigger>
            <TabsTrigger value="texts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Anliegen-Texte
            </TabsTrigger>
            <TabsTrigger value="concerns" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Anliegen-Typen
            </TabsTrigger>
          </TabsList>

          {/* Zugangsdaten Tab */}
          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Admin-Zugangsdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Benutzername</Label>
                    <Input
                      id="username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                      placeholder="Admin-Benutzername"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Neues Passwort</Label>
                    <Input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      placeholder="Neues Passwort eingeben"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSaveCredentials}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Zugangsdaten speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Feedback-Domains
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Aktuelle Domains */}
                <div className="space-y-2">
                  <Label>Aktuelle Domains</Label>
                  <div className="space-y-2">
                    {domains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">{domain}</span>
                          <Badge variant="default">Aktiv</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDomain(domain)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neue Domain hinzufügen */}
                <div className="space-y-2">
                  <Label htmlFor="newDomain">Neue Domain hinzufügen</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newDomain"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="https://feedback.example.com"
                      className="flex-1"
                    />
                    <Button onClick={handleAddDomain}>
                      <Plus className="w-4 h-4 mr-2" />
                      Hinzufügen
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Domain-Einstellungen speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anliegen-Texte Tab */}
          <TabsContent value="texts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Anliegen-Texte konfigurieren
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {concernTypes.map((concern) => (
                  <div key={concern} className="space-y-2">
                    <Label htmlFor={`text-${concern}`}>
                      {concern}
                    </Label>
                    <Textarea
                      id={`text-${concern}`}
                      value={concernTexts[concern] || ''}
                      onChange={(e) => handleUpdateConcernText(concern, e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                ))}
                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Anliegen-Texte speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anliegen-Typen Tab */}
          <TabsContent value="concerns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Anliegen-Typen verwalten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Aktuelle Anliegen */}
                <div className="space-y-2">
                  <Label>Aktuelle Anliegen-Typen</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {concernTypes.map((concern, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{concern}</span>
                          <Badge variant="default">Aktiv</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteConcernType(concern)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neues Anliegen hinzufügen */}
                <div className="space-y-2">
                  <Label htmlFor="newConcern">Neues Anliegen hinzufügen</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newConcern"
                      value={newConcernType}
                      onChange={(e) => setNewConcernType(e.target.value)}
                      placeholder="z.B. Installation"
                      className="flex-1"
                    />
                    <Button onClick={handleAddConcernType}>
                      <Plus className="w-4 h-4 mr-2" />
                      Hinzufügen
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Anliegen-Typen speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
