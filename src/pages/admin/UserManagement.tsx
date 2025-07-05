
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Search, UserX, RefreshCw, Key, Users, Trash2, Eye, EyeOff } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [accessKeys, setAccessKeys] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showPasswords, setShowPasswords] = useState(false);
  const [stats, setStats] = useState({
    totalKeys: 0,
    usedKeys: 0,
    activeUsers: 0,
    unusedKeys: 0
  });

  // Get user data from localStorage for profiles
  const getUserData = (username: string) => {
    try {
      const allUserData = JSON.parse(localStorage.getItem('allUserProfiles') || '{}');
      return allUserData[username] || null;
    } catch {
      return null;
    }
  };

  // Fetch users and access keys
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .ilike('username', `%${searchQuery}%`);
          
        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch access keys
        const { data: keysData, error: keysError } = await supabase
          .from('access_keys')
          .select('*');
          
        if (keysError) throw keysError;
        setAccessKeys(keysData || []);

        // Calculate stats
        const totalKeys = keysData?.length || 0;
        const usedKeys = keysData?.filter(key => 
          usersData?.some(user => user.username === key.username)
        ).length || 0;
        const activeUsers = usersData?.filter(user => 
          user.username && user.last_login
        ).length || 0;
        const unusedKeys = totalKeys - usedKeys;

        setStats({
          totalKeys,
          usedKeys,
          activeUsers,
          unusedKeys
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery, resetKey]);
  
  // Delete user and revoke access
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Delete user profile (this will also handle session revocation)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast.success(`Usuario ${selectedUser.username} eliminado exitosamente`);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      setResetKey(prev => prev + 1); // Force refetch
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get country from device ID (simplified approach)
  const getCountryFromDeviceId = (deviceId: string | null) => {
    if (!deviceId) return '—';
    // This is a simplified approach - in a real app you'd use a geolocation service
    return 'N/A';
  };

  // Check if credential is used
  const isCredentialUsed = (username: string) => {
    return users.some(user => user.username === username);
  };

  // Get credential status
  const getCredentialStatus = (username: string) => {
    const isUsed = isCredentialUsed(username);
    const user = users.find(u => u.username === username);
    
    if (isUsed && user?.last_login) {
      return { status: 'active', color: 'bg-yellow-500', text: 'Activo' };
    } else if (isUsed) {
      return { status: 'used', color: 'bg-red-500', text: 'Usado' };
    } else {
      return { status: 'unused', color: 'bg-green-500', text: 'Sin usar' };
    }
  };

  // Mask password
  const maskPassword = (password: string) => {
    return showPasswords ? password : '••••••••';
  };

  // Get user avatar and name from localStorage
  const getUserProfile = (username: string) => {
    const userData = getUserData(username);
    return {
      displayName: userData?.username || username,
      avatar: userData?.avatar || null
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credenciales Totales</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKeys}</div>
            <p className="text-xs text-muted-foreground">
              Credenciales disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Usar</CardTitle>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unusedKeys}</div>
            <p className="text-xs text-muted-foreground">
              Credenciales disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credenciales Usadas</CardTitle>
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usedKeys}</div>
            <p className="text-xs text-muted-foreground">
              Ya registradas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Con sesión activa
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Usuarios Registrados</TabsTrigger>
          <TabsTrigger value="credentials">Credenciales de Acceso</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" onClick={() => setResetKey(prev => prev + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>ID de Dispositivo</TableHead>
                        <TableHead>País</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead>Registrado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => {
                          const profile = getUserProfile(user.username || '');
                          return (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{profile.displayName || '—'}</span>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {user.username || '—'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Avatar className="h-8 w-8">
                                  {profile.avatar ? (
                                    <AvatarImage src={profile.avatar} alt={profile.displayName} />
                                  ) : (
                                    <AvatarFallback>
                                      {(profile.displayName || user.username || 'U').charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              </TableCell>
                              <TableCell>
                                {user.is_admin ? (
                                  <Badge>Admin</Badge>
                                ) : (
                                  <Badge variant="outline">Usuario</Badge>
                                )}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate font-mono text-xs">
                                {user.device_id || '—'}
                              </TableCell>
                              <TableCell>
                                {getCountryFromDeviceId(user.device_id)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(user.last_login)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(user.created_at)}
                              </TableCell>
                              <TableCell className="text-right">
                                {!user.is_admin && user.username && (
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                    className="hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            No se encontraron usuarios
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPasswords ? 'Ocultar' : 'Mostrar'} Contraseñas
              </Button>
            </div>
            
            <Button variant="outline" onClick={() => setResetKey(prev => prev + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estado</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Contraseña</TableHead>
                        <TableHead>Nombre Elegido</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead>Estado de Acceso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessKeys.length > 0 ? (
                        accessKeys.map((key) => {
                          const status = getCredentialStatus(key.username);
                          const isUsed = isCredentialUsed(key.username);
                          const user = users.find(u => u.username === key.username);
                          const profile = getUserProfile(key.username);
                          
                          return (
                            <TableRow key={key.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                  <Badge variant={status.status === 'unused' ? 'default' : 'secondary'}>
                                    {status.text}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {key.username}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {maskPassword(key.password)}
                              </TableCell>
                              <TableCell>
                                {isUsed ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {profile.displayName}
                                    </span>
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    No utilizado
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {isUsed && profile.avatar ? (
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={profile.avatar} alt={profile.displayName} />
                                    <AvatarFallback>
                                      {profile.displayName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(key.created_at)}
                              </TableCell>
                              <TableCell>
                                {isUsed ? (
                                  <div className="text-sm">
                                    <div className="text-green-600">✓ Acceso exitoso</div>
                                    {user?.last_login && (
                                      <div className="text-xs text-muted-foreground">
                                        Último: {formatDate(user.last_login)}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    Sin intentos
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            No hay credenciales disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Cuenta de Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar esta cuenta de usuario? 
              Esto eliminará todos sus datos y cerrará automáticamente su sesión. 
              Esta acción no se puede deshacer.
              <br /><br />
              <strong>Usuario:</strong> {selectedUser?.username}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Eliminar Usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
