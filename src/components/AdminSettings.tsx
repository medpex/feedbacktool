
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [domains, setDomains] = useState<DomainSetting[]>([
    { id: '1', domain: 'https://feedback.home-ki.eu', isActive: true }
  ]);
  const [concernTexts, setConcernTexts] = useState<ConcernText[]>([
    { concern: 'Internet-Freischaltung', text: 'Kürzlich wurde Ihr Internet freigeschaltet. Wie war Ihre Erfahrung mit unserem Service?' },
    { concern: 'Störung', text: 'Wir haben Ihre gemeldete Störung bearbeitet. Wie zufrieden sind Sie mit der Lösung?' },
    { concern: 'Servicebesuch', text: 'Unser Techniker war bei Ihnen vor Ort. Wie bewerten Sie den Servicebesuch?' },
    { concern: 'Beratung', text: 'Sie haben eine Beratung bei uns erhalten. Wie hilfreich war unser Beratungsgespräch?' },
    { concern: 'Rechnung', text: 'Bezüglich Ihrer Rechnungsanfrage: Wie zufrieden sind Sie mit der Bearbeitung?' },
    { concern: 'Kündigung', text: 'Ihre Kündigung wurde bearbeitet. Wie bewerten Sie unseren Kündigungsprozess?' },
    { concern: 'Sonstiges', text: 'Wie war Ihre Erfahrung mit unserem Service?' }
  ]);
  const [concernTypes, setConcernTypes] = useState<ConcernType[]>([
    { id: '1', name: 'Internet-Freischaltung', isActive: true },
    { id: '2', name: 'Störung', isActive: true },
    { id: '3', name: 'Servicebesuch', isActive: true },
    { id: '4', name: 'Beratung', isActive: true },
    { id: '5', name: 'Rechnung', isActive: true },
    { id: '6', name: 'Kündigung', isActive: true },
    { id: '7', name: 'Sonstiges', isActive: true }
  ]);
  
  const [newDomain, setNewDomain] = useState('');
  const [newConcernType, setNewConcernType] = useState('');
  const [loading, setLoading] = useState(false);

  // Zugangsdaten speichern
  const handleSaveCredentials = async () => {
    setLoading(true);
    try {
      // Hier würde normalerweise ein API-Call stattfinden
      // await saveAdminCredentials(credentials);
      toast.success('Zugangsdaten erfolgreich aktualisiert');
    } catch (error) {
      toast.error('Fehler beim Speichern der Zugangsdaten');
    } finally {
      setLoading(false);
    }
  };

  // Domain hinzufügen
  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    
    const newDomainObj: DomainSetting = {
      id: Date.now().toString(),
      domain: newDomain.trim(),
      isActive: true
    };
    
    setDomains([...domains, newDomainObj]);
    setNewDomain('');
    toast.success('Domain hinzugefügt');
  };

  // Domain löschen
  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
    toast.success('Domain entfernt');
  };

  // Domain-Status ändern
  const handleToggleDomain = (id: string) => {
    setDomains(domains.map(d => 
      d.id === id ? { ...d, isActive: !d.isActive } : d
    ));
  };

  // Anliegen-Text aktualisieren
  const handleUpdateConcernText = (concern: string, text: string) => {
    setConcernTexts(concernTexts.map(ct => 
      ct.concern === concern ? { ...ct, text } : ct
    ));
  };

  // Anliegen-Texte speichern
  const handleSaveConcernTexts = async () => {
    setLoading(true);
    try {
      // Hier würde normalerweise ein API-Call stattfinden
      // await saveConcernTexts(concernTexts);
      toast.success('Anliegen-Texte erfolgreich gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern der Anliegen-Texte');
    } finally {
      setLoading(false);
    }
  };

  // Neues Anliegen hinzufügen
  const handleAddConcernType = () => {
    if (!newConcernType.trim()) return;
    
    const newConcern: ConcernType = {
      id: Date.now().toString(),
      name: newConcernType.trim(),
      isActive: true
    };
    
    setConcernTypes([...concernTypes, newConcern]);
    
    // Auch einen Standard-Text hinzufügen
    setConcernTexts([...concernTexts, {
      concern: newConcernType.trim(),
      text: 'Wie war Ihre Erfahrung mit unserem Service?'
    }]);
    
    setNewConcernType('');
    toast.success('Anliegen hinzugefügt');
  };

  // Anliegen löschen
  const handleDeleteConcernType = (id: string, name: string) => {
    setConcernTypes(concernTypes.filter(ct => ct.id !== id));
    setConcernTexts(concernTexts.filter(ct => ct.concern !== name));
    toast.success('Anliegen entfernt');
  };

  // Anliegen-Status ändern
  const handleToggleConcernType = (id: string) => {
    setConcernTypes(concernTypes.map(ct => 
      ct.id === id ? { ...ct, isActive: !ct.isActive } : ct
    ));
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
                    {domains.map((domain) => (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">{domain.domain}</span>
                          <Badge variant={domain.isActive ? "default" : "secondary"}>
                            {domain.isActive ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleDomain(domain.id)}
                          >
                            {domain.isActive ? "Deaktivieren" : "Aktivieren"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDomain(domain.id)}
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
                {concernTexts.map((concernText) => (
                  <div key={concernText.concern} className="space-y-2">
                    <Label htmlFor={`text-${concernText.concern}`}>
                      {concernText.concern}
                    </Label>
                    <Textarea
                      id={`text-${concernText.concern}`}
                      value={concernText.text}
                      onChange={(e) => handleUpdateConcernText(concernText.concern, e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                ))}
                <Button 
                  onClick={handleSaveConcernTexts}
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
                    {concernTypes.map((concern) => (
                      <div key={concern.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{concern.name}</span>
                          <Badge variant={concern.isActive ? "default" : "secondary"}>
                            {concern.isActive ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleConcernType(concern.id)}
                          >
                            {concern.isActive ? "Deaktivieren" : "Aktivieren"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteConcernType(concern.id, concern.name)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
