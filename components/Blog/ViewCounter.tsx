'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React, { useEffect, useState } from 'react'

type ViewCounterProps = {
  slug: string
  noCount?: boolean
  showCount?: boolean
}

const ViewCounter = ({ slug, noCount = false, showCount = true }: ViewCounterProps) => {
  const supabase = createClientComponentClient()
  const [views, setViews] = useState(0)

  useEffect(() => {
    const incrementView = async () => {
      try {
        let { data, error } = await supabase.rpc('increment', {
          slug_text: slug,
        })
        if (error) {
          console.error('Error when call increment function', error)
        }
      } catch (error) {
        console.error('An error occurred while incrementing the view count:', error)
      }
    }

    if (!noCount) {
      incrementView()
    }
  }, [slug, noCount, supabase])

  useEffect(() => {
    const getViews = async () => {
      try {
        let { data, error } = await supabase.from('views').select().match({ slug: slug }).single()

        if (error) {
          console.log('Dinh loi khi lay Views', error)
        }

        setViews(data ? data.count : 0)
      } catch (error) {
        console.error('An error occurred while incrementing the view count:', error)
      }
    }
    getViews()
  }, [slug, supabase])

  if (showCount) {
    return <div>{views} views</div>
  } else {
    return null
  }
}

export default ViewCounter
