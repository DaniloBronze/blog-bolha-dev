'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) setCategories(await res.json())
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const slugFromName = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || slugFromName(formData.name),
          description: formData.description || null,
        }),
      })
      if (res.ok) {
        setFormData({ name: '', slug: '', description: '' })
        await fetchCategories()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId == null) return
    setSaving(true)
    try {
      const res = await fetch(`/api/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || slugFromName(formData.name),
          description: formData.description || null,
        }),
      })
      if (res.ok) {
        setEditingId(null)
        setFormData({ name: '', slug: '', description: '' })
        await fetchCategories()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta categoria? Posts vinculados ficarão sem categoria.')) return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEditingId((prev) => (prev === id ? null : prev))
        await fetchCategories()
      }
    } catch (_) {}
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Categorias</h1>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 p-6 max-w-md">
        <h2 className="text-lg font-semibold text-white mb-4">
          {editingId != null ? 'Editar categoria' : 'Nova categoria'}
        </h2>
        <form
          onSubmit={editingId != null ? handleUpdate : handleCreate}
          className="space-y-4"
        >
          <div>
            <label htmlFor="cat-name" className="block text-sm font-medium text-white/90 mb-1">
              Nome
            </label>
            <input
              id="cat-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: prev.slug || slugFromName(e.target.value),
                }))
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="cat-slug" className="block text-sm font-medium text-white/90 mb-1">
              Slug (URL)
            </label>
            <input
              id="cat-slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="cat-desc" className="block text-sm font-medium text-white/90 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="cat-desc"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : editingId != null ? 'Atualizar' : 'Criar'}
            </button>
            {editingId != null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Lista de categorias</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-white/70">Carregando...</div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-8 text-center text-white/70">Nenhuma categoria.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/90">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/90">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/90">Descrição</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-white/90">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5">
                    <td className="px-6 py-3 text-white">{cat.name}</td>
                    <td className="px-6 py-3 text-white/70">
                      <Link
                        href={`/categoria/${cat.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-300"
                      >
                        /categoria/{cat.slug}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-white/60 text-sm max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="text-white/70 hover:text-blue-300 p-1"
                        title="Editar"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="text-white/70 hover:text-red-300 p-1 ml-2"
                        title="Excluir"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
