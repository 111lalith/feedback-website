export type StreamType = 'Full Stack Development' | 'Data Analytics';

export type CourseType = 'BCA' | 'BBA' | 'BCOM' | 'BCOM (A & F)' | 'BCOM LSCM';
export type YearType = 'Year 1' | 'Year 2' | 'Year 3';
export type SectionType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
export type LaptopStatusType = 'I have laptop' | "I don't have laptop" | 'I have at home';

export const COURSES: CourseType[] = ['BCA', 'BBA', 'BCOM', 'BCOM (A & F)', 'BCOM LSCM'];
export const YEARS: YearType[] = ['Year 1', 'Year 2', 'Year 3'];
export const SECTIONS: SectionType[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
export const LAPTOP_OPTIONS: { id: LaptopStatusType; label: string; sublabel: string }[] = [
  { 
    id: 'I have laptop', 
    label: 'I have laptop', 
    sublabel: 'I bring my own laptop to the workshop sessions' 
  },
  { 
    id: "I don't have laptop", 
    label: "I don't have laptop", 
    sublabel: 'I do not own a laptop, utilizing college lab systems' 
  },
  { 
    id: 'I have at home', 
    label: 'I have at home', 
    sublabel: 'I own a laptop but keep it at home / not bringing daily' 
  }
];

export interface Student {
  id: string;
  name: string;
  phone: string;
  idCardNo: string;
  email: string;
  course: CourseType;
  year: YearType;
  section: SectionType;
  classSection: string; // Formatted e.g. "BCA - Year 2 - Sec A"
  stream: StreamType;
  laptopStatus: LaptopStatusType;
  hasLaptop?: boolean; // legacy compatibility
  registeredAt: number; // timestamp ms
}

export interface Review {
  id: string;
  studentId: string;
  day: number; // 1 to 18
  overallRating: number; // 1 to 5
  contentRating?: number; // 1 to 5 (legacy/optional)
  trainerRating?: number; // 1 to 5 (legacy/optional)
  paceRating?: number; // 1 to 5 (legacy/optional)
  practicalRating?: number; // 1 to 5 (legacy/optional)
  liked: string;
  improve: string;
  recommend: boolean;
  submittedAt: number; // timestamp ms
  studentName?: string;
  studentStream?: StreamType;
  idCardNo?: string;
  course?: CourseType;
  year?: YearType;
  section?: SectionType;
  laptopStatus?: LaptopStatusType;
}

export interface DeletedHistoryItem {
  id: string;
  type: 'single_student' | 'entire_database';
  description: string;
  deletedAt: number;
  deletedBy: string;
  studentCount: number;
  reviewCount: number;
  studentName?: string;
  idCardNo?: string;
  studentsData?: Student[];
  reviewsData?: Review[];
}

export interface DayAccessConfig {
  day: number; // 1 to 18
  isOpen: boolean; // whether remarks / feedback is open for this day
  openedAt?: number;
  topicFocus?: string;
  remarksAllowed?: boolean;
  notes?: string;
}

export interface FeedbackSettings {
  id: string; // 'feedback_config'
  unlockedDays: number[]; // Array of currently unlocked day numbers, e.g. [1, 2]
  dayConfigs: Record<number, DayAccessConfig>;
  globalOpen?: boolean;
  updatedAt: number;
  updatedBy?: string;
}

export interface DailyRemark {
  id: string;
  studentId: string;
  day: number;
  studentName: string;
  studentRollNo: string;
  idCardNo: string;
  studentEmail?: string;
  studentCourse?: string;
  studentYear?: string;
  studentSection?: string;
  studentStream: StreamType;
  rating: number; // 1 to 5 stars
  remarks: string; // detailed daily remarks & feedback
  keyLearnings?: string; // what student learned today
  doubts?: string; // queries / difficulty faced
  recommend: boolean;
  submittedAt: number;
}

export interface DayTopic {
  day: number;
  fullStackTopic: string;
  dataAnalyticsTopic: string;
  fullStackDetail: string;
  dataAnalyticsDetail: string;
  fullStackBadge?: string;
  dataAnalyticsBadge?: string;
  description?: string;
}

export const WORKSHOP_TOPICS: DayTopic[] = [
  {
    day: 1,
    fullStackTopic: "HTML5 Structure & Semantic Layouts",
    dataAnalyticsTopic: "Advanced Excel Fundamentals",
    fullStackDetail: "Structure real web pages, Forms and input elements, Tables and data display, Semantic tags.",
    dataAnalyticsDetail: "Interface, Row/Column, Ribbon, Data Entry, Formatting, Number Formats, Tables, Sort, Filter, Freeze Panes (12:30 - 2:30 PM).",
    fullStackBadge: "01 HTML",
    dataAnalyticsBadge: "Excel Day 01"
  },
  {
    day: 2,
    fullStackTopic: "CSS3 Responsive Layouts & Styling",
    dataAnalyticsTopic: "Excel Formulas & Basic Functions",
    fullStackDetail: "Responsive layouts, Flexbox for alignment, Grid for complex layouts, Styling & themes, Reusable components.",
    dataAnalyticsDetail: "Formula basics, operators, SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTBLANK, Basic IF.",
    fullStackBadge: "02 CSS",
    dataAnalyticsBadge: "Excel Day 02"
  },
  {
    day: 3,
    fullStackTopic: "Hands-on Project: Responsive Canteen Menu",
    dataAnalyticsTopic: "Logical, Text & Date Functions",
    fullStackDetail: "Build a responsive college canteen menu layout with interactive cards, items list, and price layout.",
    dataAnalyticsDetail: "IF, AND, OR, IFERROR, VLOOKUP, LEFT, RIGHT, MID, CONCAT, TEXT functions, TODAY, DATEDIF, EDATE, EOMONTH.",
    fullStackBadge: "Project 01",
    dataAnalyticsBadge: "Excel Day 03"
  },
  {
    day: 4,
    fullStackTopic: "Git Version Control & VS Code Mastery",
    dataAnalyticsTopic: "Lookup & Advanced Functions",
    fullStackDetail: "Version control with Git, Branching & merging, Commits & history, Debugging & VS Code workflow.",
    dataAnalyticsDetail: "VLOOKUP + MATCH, INDEX + MATCH, XLOOKUP, OFFSET, INDIRECT, SUMIFS, COUNTIFS, AVERAGEIFS.",
    fullStackBadge: "06 Git & VS Code",
    dataAnalyticsBadge: "Excel Day 04"
  },
  {
    day: 5,
    fullStackTopic: "Python Fundamentals & Data Structures",
    dataAnalyticsTopic: "Power Query Data Transformation",
    fullStackDetail: "Variables and data types, Data structures (list, dict, tuples, sets), Control flow & basic logic.",
    dataAnalyticsDetail: "Import CSV/Excel data, cleaning, data types, nulls, duplicates, Merge Queries, Append Queries, Transformations & applied steps.",
    fullStackBadge: "04 Python",
    dataAnalyticsBadge: "Excel Day 05"
  },
  {
    day: 6,
    fullStackTopic: "Python Functions, Modules & OOP Basics",
    dataAnalyticsTopic: "Pivot Tables & Dynamic Data Analysis",
    fullStackDetail: "Functions and modules, Scope, Error handling, Exception blocks, Object-oriented programming basics.",
    dataAnalyticsDetail: "Pivot Tables from scratch, Row/Columns/Values/Filters, Pivot Charts, Slicers, Timelines, Calculated Fields & Dashboard.",
    fullStackBadge: "04 Python Deep Dive",
    dataAnalyticsBadge: "Excel Day 06"
  },
  {
    day: 7,
    fullStackTopic: "Hands-on Project: Python Order Calculator",
    dataAnalyticsTopic: "Advanced Excel Tools & Power Pivot",
    fullStackDetail: "Create a Python command-line Order & Total Calculator with tax, discount computation, and itemized summaries.",
    dataAnalyticsDetail: "Goal Seek, Scenario Manager, Data Tables, Financial Functions, Power Pivot Data Model - Relationships & Measures.",
    fullStackBadge: "Project 02",
    dataAnalyticsBadge: "Excel Day 07"
  },
  {
    day: 8,
    fullStackTopic: "SQL & SQLite Database Architecture",
    dataAnalyticsTopic: "Excel Capstone Project & Dashboard",
    fullStackDetail: "Tables and columns, Primary keys, Foreign keys, Relationships, CRUD queries & database design.",
    dataAnalyticsDetail: "Heavy dataset cleaning and transformation, Analysis, Pivot Dashboard, Final executive report & presentation.",
    fullStackBadge: "03 SQL/SQLite",
    dataAnalyticsBadge: "Excel Capstone"
  },
  {
    day: 9,
    fullStackTopic: "SQL CRUD Queries & Data Management",
    dataAnalyticsTopic: "Tableau Introduction & Interface Navigation",
    fullStackDetail: "SELECT, INSERT, UPDATE, DELETE, WHERE filtering, Sorting, JOIN operations, and SQLite database storage.",
    dataAnalyticsDetail: "Tableau Introduction (Importance, Why Tableau vs Power BI vs Excel) + Interface, Dimensions, Data types & Measures (12:30 - 2:30 PM).",
    fullStackBadge: "03 SQL Queries",
    dataAnalyticsBadge: "Tableau Day 01"
  },
  {
    day: 10,
    fullStackTopic: "Hands-on Project: Design Order Database",
    dataAnalyticsTopic: "Simple Visualizations & Advanced Graphs",
    fullStackDetail: "Design an Order Database schema in SQLite for users, menu catalog, cart items, and order transactions.",
    dataAnalyticsDetail: "Simple & Visualizations (Bar & Chart - Previous concept recap) + Advanced Graphs practical implementation.",
    fullStackBadge: "Project 03",
    dataAnalyticsBadge: "Tableau Day 02"
  },
  {
    day: 11,
    fullStackTopic: "Flask Web Framework: Routing & Handlers",
    dataAnalyticsTopic: "Tableau Parameters & Interactive Dashboards",
    fullStackDetail: "Flask architecture, Routes and URL handling, View functions, Request handling & dynamic endpoints.",
    dataAnalyticsDetail: "Parameters creation & practical usage + Dashboard: Hierarchy, Filters, Dashboard Actions & hands-on practice.",
    fullStackBadge: "05 Flask",
    dataAnalyticsBadge: "Tableau Day 03"
  },
  {
    day: 12,
    fullStackTopic: "Flask Templates, Jinja2 & Rendering",
    dataAnalyticsTopic: "Clustering & Advanced Visualization Types",
    fullStackDetail: "Templates and rendering with Jinja2, Passing dynamic data, Template inheritance & layout components.",
    dataAnalyticsDetail: "Clustering concept + practice + Advanced Visualization Types (Treemaps, Heatmaps, Dual Axis).",
    fullStackBadge: "05 Flask Templates",
    dataAnalyticsBadge: "Tableau Day 04"
  },
  {
    day: 13,
    fullStackTopic: "Flask Forms, Validation & User State",
    dataAnalyticsTopic: "Tableau Calculations & Visual Storytelling",
    fullStackDetail: "Forms and input validation, Handling POST submissions, Flask sessions, Flash messages & user state management.",
    dataAnalyticsDetail: "Calculations (Calculated Fields & Table Calculations) + Visual Data Storytelling & narrative building.",
    fullStackBadge: "05 Flask State",
    dataAnalyticsBadge: "Tableau Day 05"
  },
  {
    day: 14,
    fullStackTopic: "Hands-on Project: Flask Pre-Order Web App",
    dataAnalyticsTopic: "Tableau PPT Presentation & LOD Calculations",
    fullStackDetail: "Develop a functional Flask web application allowing students to browse menu, select items, and place pre-orders.",
    dataAnalyticsDetail: "PPT + Presentation + Level of Detail (LOD - INCLUDE & EXCLUDE expressions + practice).",
    fullStackBadge: "Project 04",
    dataAnalyticsBadge: "Tableau Day 06"
  },
  {
    day: 15,
    fullStackTopic: "Full-Stack Integration: Frontend + Python + SQL",
    dataAnalyticsTopic: "Final Tableau Dashboard Project Showcase",
    fullStackDetail: "Integrate HTML/CSS frontend with Flask routes and SQLite persistent database queries.",
    dataAnalyticsDetail: "Final Tableau Dashboard Project build + Project Presentation, Evaluation, Review & Feedback.",
    fullStackBadge: "Full-Stack Bridge",
    dataAnalyticsBadge: "Tableau Capstone"
  },
  {
    day: 16,
    fullStackTopic: "Hands-on Project: Complete Canteen Integration",
    dataAnalyticsTopic: "Multi-Tool BI: Excel + Tableau + Power BI",
    fullStackDetail: "Integrate the complete Full-Stack College Canteen Pre-Order System (Menu, Cart, Orders, Admin view).",
    dataAnalyticsDetail: "Connecting Excel data pipelines, Tableau executive dashboards, and business intelligence reporting workflows.",
    fullStackBadge: "Project 05",
    dataAnalyticsBadge: "BI Ecosystem"
  },
  {
    day: 17,
    fullStackTopic: "Capstone Polish, Testing & Deployment Prep",
    dataAnalyticsTopic: "Executive Data Insights & Business Decision Making",
    fullStackDetail: "Test, debug, refactor code, polish UI responsiveness, and prepare production run on server.",
    dataAnalyticsDetail: "Case studies in translating raw data into actionable executive decision-making and business metrics.",
    fullStackBadge: "Capstone Prep",
    dataAnalyticsBadge: "Analytics Insights"
  },
  {
    day: 18,
    fullStackTopic: "Practical Capstone Demo & Club Graduation",
    dataAnalyticsTopic: "Grand Analytics Portfolio Showcase & Graduation",
    fullStackDetail: "Build and test a College Canteen Pre-Order System from start to finish using HTML/CSS -> SQLite -> Python -> Flask. Jury demo & graduation!",
    dataAnalyticsDetail: "Final Analytics Project Evaluation, Portfolio Defense, Jury Review, Feedback & Club Graduation Ceremony!",
    fullStackBadge: "Capstone Demo",
    dataAnalyticsBadge: "Club Graduation"
  }
];

