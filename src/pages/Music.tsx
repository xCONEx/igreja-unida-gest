
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music2, Plus, Search, Filter, Play, Heart, ExternalLink, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const Music = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const songs = [
    {
      id: 1,
      title: 'Reckless Love',
      artist: 'Cory Asbury',
      key: 'C',
      bpm: 76,
      genre: 'Contemporâneo',
      tags: ['Amor de Deus', 'Adoração'],
      isFavorite: true,
      hasChords: true,
      hasLyrics: true,
      playCount: 23,
      lastPlayed: '2024-12-10'
    },
    {
      id: 2,
      title: 'Way Maker',
      artist: 'Sinach',
      key: 'G',
      bpm: 68,
      genre: 'Gospel',
      tags: ['Milagres', 'Fé'],
      isFavorite: true,
      hasChords: true,
      hasLyrics: true,
      playCount: 31,
      lastPlayed: '2024-12-08'
    },
    {
      id: 3,
      title: 'Goodness of God',
      artist: 'Bethel Music',
      key: 'D',
      bpm: 72,
      genre: 'Contemporâneo',
      tags: ['Bondade', 'Gratidão'],
      isFavorite: false,
      hasChords: true,
      hasLyrics: true,
      playCount: 18,
      lastPlayed: '2024-12-05'
    },
    {
      id: 4,
      title: 'Oceans',
      artist: 'Hillsong United',
      key: 'A',
      bpm: 80,
      genre: 'Contemporâneo',
      tags: ['Confiança', 'Fé'],
      isFavorite: false,
      hasChords: true,
      hasLyrics: true,
      playCount: 27,
      lastPlayed: '2024-12-12'
    },
    {
      id: 5,
      title: 'Build My Life',
      artist: 'Pat Barrett',
      key: 'E',
      bpm: 74,
      genre: 'Contemporâneo',
      tags: ['Entrega', 'Adoração'],
      isFavorite: true,
      hasChords: true,
      hasLyrics: true,
      playCount: 15,
      lastPlayed: '2024-12-07'
    },
    {
      id: 6,
      title: 'What a Beautiful Name',
      artist: 'Hillsong Worship',
      key: 'F',
      bpm: 70,
      genre: 'Contemporâneo',
      tags: ['Jesus', 'Nome'],
      isFavorite: false,
      hasChords: true,
      hasLyrics: true,
      playCount: 22,
      lastPlayed: '2024-12-09'
    }
  ];

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getKeyColor = (key: string) => {
    const colors = {
      'C': 'bg-red-100 text-red-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-yellow-100 text-yellow-800',
      'F': 'bg-green-100 text-green-800',
      'G': 'bg-blue-100 text-blue-800',
      'A': 'bg-indigo-100 text-indigo-800',
      'B': 'bg-purple-100 text-purple-800'
    };
    return colors[key as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Biblioteca Musical</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seu repertório, letras e cifras
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Música
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, artista ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <Card key={song.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Music2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold truncate">
                        {song.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {song.isFavorite && (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tom:</span>
                    <Badge variant="secondary" className={getKeyColor(song.key)}>
                      {song.key}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">BPM:</span>
                    <span className="font-medium">{song.bpm}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gênero:</span>
                    <span className="text-sm text-gray-700 truncate">{song.genre}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tocada:</span>
                    <span className="text-sm text-gray-700">{song.playCount}x</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-1">
                    {song.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                  <span>Última vez: {new Date(song.lastPlayed).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Cifra
                  </Button>
                  <Button size="sm">
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSongs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Music2 className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma música encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente alterar os termos de busca' : 'Comece adicionando músicas ao seu repertório'}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Música
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{songs.length}</div>
              <div className="text-sm text-gray-600">Total de Músicas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {songs.filter(s => s.isFavorite).length}
              </div>
              <div className="text-sm text-gray-600">Favoritas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {songs.filter(s => s.hasChords && s.hasLyrics).length}
              </div>
              <div className="text-sm text-gray-600">Completas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(songs.reduce((sum, song) => sum + song.playCount, 0) / songs.length)}
              </div>
              <div className="text-sm text-gray-600">Média de Uso</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Music;
