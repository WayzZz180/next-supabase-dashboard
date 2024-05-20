import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  createServerActionsKeyFactory,
  setupServerActionHooks
} from "zsa-react-query"

const QueryKeyFactory = createServerActionsKeyFactory({
  getBlogs: () => ["blogs"],
})

const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery,
} = setupServerActionHooks({
  hooks: {
    useQuery: useQuery,
    useMutation: useMutation,
    useInfiniteQuery: useInfiniteQuery,
  },
  queryKeyFactory: QueryKeyFactory
})

export {
  useServerActionInfiniteQuery,
  useServerActionMutation,
  useServerActionQuery,
}