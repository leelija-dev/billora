import React from 'react'
import FetchBlogs from "./Fetch-Blogs"
 export const metadata = {
  title: "Blog – GST, Billing & Inventory Tips | The Fast Bill",
  description: "Read The Fast Bill blog for practical tips on GST billing, inventory management, tax compliance, and growing your business in India. Updated regularly."
}

const page = () => {
  return (
   <FetchBlogs/>
  )
}

export default page
