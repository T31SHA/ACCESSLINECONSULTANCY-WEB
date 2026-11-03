import { groq } from "next-sanity";

const seo = (fallbackDesc: string) => `"seo": { "title": coalesce(seo.title, title), "description": coalesce(seo.description, ${fallbackDesc}) }`;

export const services = groq`*[_type == "service" && defined(slug.current)] | order(order asc, title asc) {
  "slug": slug.current, title, short, icon, ${seo("short")}, problem, outcome, deliverables,
  process[]{ title, body }, "faqs": coalesce(faqs[]->{ "q": question, "a": answer }, []), sample
}`;

export const industries = groq`*[_type == "industry" && defined(slug.current)] | order(order asc, title asc) {
  "slug": slug.current, title, short, ${seo("short")}, challenges, approach, sample
}`;

export const caseStudies = groq`*[_type == "caseStudy" && defined(slug.current)] | order(year desc, title asc) {
  "slug": slug.current, client, title, summary, "services": coalesce(services[]->slug.current, []),
  "industry": industry->slug.current, year, "image": image.asset->url, "imageAlt": image.alt,
  challenge, approach, metrics[]{ value, label }, quote{ text, author, role }, sample
}`;

export const team = groq`*[_type == "teamMember" && defined(slug.current)] | order(order asc, name asc) {
  "slug": slug.current, name, role, department, "photo": photo.asset->url, linkedin, bio, leadership, sample
}`;

export const posts = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current, title, excerpt, category, "date": publishedAt, readingMinutes,
  "author": author->slug.current, "image": image.asset->url, "imageAlt": image.alt, featured,
  body[]{ heading, paragraphs }, sample
}`;

export const jobs = groq`*[_type == "job" && defined(slug.current)] | order(posted desc) {
  "slug": slug.current, title, department, location, type, posted, validThrough, summary,
  responsibilities, requirements, sample
}`;

export const testimonials = groq`*[_type == "testimonial"] | order(_createdAt asc) { quote, author, role, organisation, sample }`;

export const clientLogos = groq`*[_type == "clientLogo"] | order(order asc, name asc) { name, "src": logo.asset->url, sample }`;

export const siteSettings = groq`*[_type == "siteSettings"][0] { stats[]{ value, suffix, label, sample }, socials, calUrl }`;
