// schemas/seriesIndex.ts
import {defineType, defineField} from 'sanity'

export const seriesIndexType = defineType({
  name: 'seriesIndex',
  title: 'Series Index',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Index Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{type: 'series'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'posts',
      title: 'Posts in Series',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'post'}],
        options: {
          filter: ({document}) => {
            // Only show posts that belong to the selected series
            if (!(document.series as {_ref?: string})?._ref) return {filter: 'false'}
            return {
              filter: 'series._ref == $seriesRef',
              params: {seriesRef: (document.series as {_ref: string})._ref}
            }
          }
        }
      }],
      description: 'Drag and drop to reorder posts in the series',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      seriesTitle: 'series.title',
      postCount: 'posts.length',
    },
    prepare(selection) {
      const {title, seriesTitle, postCount} = selection
      return {
        title: title,
        subtitle: `${seriesTitle} â€¢ ${postCount || 0} posts`,
      }
    },
  },
})