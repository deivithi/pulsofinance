import { useState } from 'react';
import { Plus, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategorias, Categoria } from '@/hooks/useCategorias';
import { useCategoriaMutations } from '@/hooks/useCategoriaMutations';
import { CategoriaCard } from '@/components/categorias/CategoriaCard';
import { CategoriaForm } from '@/components/categorias/CategoriaForm';
import { DeleteCategoriaDialog } from '@/components/categorias/DeleteCategoriaDialog';

export default function Categorias() {
  const { data: categorias = [], isLoading } = useCategorias();
  const { createDefaultCategorias } = useCategoriaMutations();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(null);

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    setDeletingCategoria(categoria);
    setDeleteDialogOpen(true);
  };

  const handleNewCategoria = () => {
    setEditingCategoria(null);
    setFormOpen(true);
  };

  const handleCreateDefaults = async () => {
    await createDefaultCategorias.mutateAsync();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (categorias.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Categorias</h2>
          <p className="text-muted-foreground">Organize seus gastos por categoria</p>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center">
          <Tag className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-3 text-foreground">
            Nenhuma categoria ainda
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Crie categorias para organizar melhor seus parcelamentos e assinaturas.
            Você pode começar com nossas sugestões!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={handleCreateDefaults}
              disabled={createDefaultCategorias.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {createDefaultCategorias.isPending ? 'Criando...' : 'Criar Categorias Sugeridas'}
            </Button>
            <Button
              onClick={handleNewCategoria}
              variant="outline"
              className="border-border hover:bg-muted/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Manualmente
            </Button>
          </div>
        </div>

        <CategoriaForm
          open={formOpen}
          onOpenChange={setFormOpen}
          categoria={editingCategoria}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Categorias</h2>
          <p className="text-muted-foreground">
            {categorias.length} {categorias.length === 1 ? 'categoria' : 'categorias'}
          </p>
        </div>
        <Button onClick={handleNewCategoria} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Form Modal */}
      <CategoriaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        categoria={editingCategoria}
      />

      {/* Delete Dialog */}
      <DeleteCategoriaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoria={deletingCategoria}
      />
    </div>
  );
}
