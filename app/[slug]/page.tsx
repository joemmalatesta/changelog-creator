import { Metadata } from 'next'
import { getSession } from 'next-auth/react'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Repository: ${params.slug}`,
  }
}

export default async function Page({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Repository: {params.slug}</h1>
    </div>
  )
}
