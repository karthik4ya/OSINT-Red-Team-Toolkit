import { OsintTool } from './types';

export const OSINT_TOOLS: OsintTool[] = [
  {
    id: 1,
    name: 'theharvester',
    category: 'Email & IP Reconnaissance',
    description: 'Gives the list of publicly accessible emails and IP addresses from a specific domain.',
    commandTemplate: 'theharvester -d {INPUT} -b bing',
    commandPlaceholder: 'e.g., kali.org',
    inputType: 'text',
  },
  {
    id: 2,
    name: 'ExifTool',
    category: 'Metadata Extraction',
    description: 'Extracts metadata from files. Upload an image to check its details.',
    inputType: 'file',
    accept: 'image/*',
  },
  {
    id: 3,
    name: 'Photon',
    category: 'Web Crawler',
    description: 'Crawls a URL or an uploaded HTML file to extract URLs, emails, files, website accounts and more.',
    commandTemplate: 'photon -u {INPUT}',
    commandPlaceholder: 'e.g., https://example.com',
    inputType: 'text',
    allowFileUpload: true,
    accept: '.html,text/html',
  },
  {
    id: 4,
    name: 'Sherlock',
    category: 'Username Search',
    description: 'Searches for a username across a vast number of social media platforms.',
    commandTemplate: 'sherlock {INPUT}',
    commandPlaceholder: 'e.g., johndoe',
    inputType: 'text',
  },
  {
    id: 5,
    name: 'Maltego',
    category: 'Link Analysis',
    description: 'Simulate a Maltego transform to map connections between entities by gathering information like emails, domains, IPs, and social media.',
    commandTemplate: 'maltego -t {INPUT}',
    commandPlaceholder: 'e.g., example.com',
    inputType: 'text',
  },
  {
    id: 6,
    name: 'Shodan',
    category: 'Device & Vulnerability Search',
    description: 'The search engine for Internet-connected devices. Simulate a search for devices and vulnerabilities.',
    commandTemplate: 'shodan search {INPUT}',
    commandPlaceholder: 'e.g., webcam',
    inputType: 'text',
  },
  {
    id: 7,
    name: 'Reverse Image Search',
    category: 'Image Analysis',
    description: 'Use services like Yandex, Google, and TinEye to search for the source of an image, find missing persons, or investigate for any purpose.',
    url: 'https://images.google.com/'
  },
  {
    id: 8,
    name: 'Online EXIF Viewer',
    category: 'Metadata Extraction',
    description: 'Gives info about where, when, what device with specifications and on which platform a photo was posted.',
    url: 'https://onlineexifviewer.com/'
  },
  {
    id: 9,
    name: 'Google Maps',
    category: 'Physical Location Analysis',
    description: 'Used for analyzing physical locations, geolocation intelligence, and reconnaissance.',
    url: 'https://maps.google.com/'
  },
  {
    id: 10,
    name: 'Breached Password Checkers',
    category: 'Credential Exposure',
    description: 'Check if your username or password has been exposed in a data breach using services like Have I Been Pwned, Snusbase, or LeakCheck.',
    url: 'https://haveibeenpwned.com/'
  },
  {
    id: 11,
    name: 'White Pages',
    category: 'People Search',
    description: 'Searching for people, find people fast and free, fast background check.',
    url: 'https://www.whitepages.com/'
  },
  {
    id: 12,
    name: 'SpiderFoot',
    category: 'Automated Reconnaissance',
    description: 'Simulate an automated multi-source reconnaissance scan for quick, repeatable footprinting.',
    commandTemplate: 'spiderfoot -s {INPUT}',
    commandPlaceholder: 'e.g., example.com',
    inputType: 'text',
  },
  {
    id: 13,
    name: 'Wayback Machine (Archive.org)',
    category: 'Historical Website Analysis',
    description: 'Provides historical snapshots of websites; indispensable for timelines and deleted content.',
    url: 'https://archive.org/'
  },
  {
    id: 14,
    name: 'VirusTotal',
    category: 'Malware Analysis',
    description: 'Simulate a multi-engine scan for files, URLs, domains, and certificates.',
    commandTemplate: 'virustotal scan {INPUT}',
    commandPlaceholder: 'e.g., malicious-url.com',
    inputType: 'text',
  },
  {
    id: 15,
    name: 'Instaloader',
    category: 'Social Media Analysis',
    description: 'Downloads Instagram posts and their metadata for analysis.',
    commandTemplate: 'instaloader {INPUT}',
    commandPlaceholder: 'e.g., instagram_profile',
    inputType: 'text',
  },
  {
    id: 16,
    name: 'Namechk',
    category: 'Username Search',
    description: 'Checks for username availability across dozens of social networks and domain names.',
    url: 'https://namechk.com/'
  }
];