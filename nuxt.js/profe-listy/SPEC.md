# Attendance App - Specification

## 1. Project Overview

- **Project name**: Attendance App
- **Type**: Desktop application (Electron + React)
- **Core functionality**: A CRUD application for teachers to manage student groups, students, and track attendance with statistics dashboard
- **Target users**: Teachers/Professors who need to take attendance in local environments

## 2. Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron
- **Database**: MySQL (local)
- **ORM**: mysql2 / better-sqlite3 (for simpler setup)

## 3. Database Schema

### Tables

#### groups
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

#### students
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NULL |
| group_id | INT | FOREIGN KEY -> groups.id |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

#### attendances
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| student_id | INT | FOREIGN KEY -> students.id |
| date | DATE | NOT NULL |
| status | ENUM('present', 'absent', 'late') | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## 4. UI/UX Specification

### Layout Structure

- **Single window application** with sidebar navigation
- **Sidebar** (200px width): Navigation menu (Groups, Students, Attendance, Dashboard)
- **Main content area**: Dynamic based on selected section

### Visual Design

#### Color Palette
- **Primary**: #2563eb (Blue)
- **Secondary**: #64748b (Slate)
- **Accent**: #10b981 (Emerald)
- **Background**: #f8fafc (Light gray)
- **Surface**: #ffffff (White)
- **Text Primary**: #1e293b
- **Text Secondary**: #64748b
- **Error**: #ef4444
- **Success**: #22c55e

#### Typography
- **Font family**: Inter, system-ui, sans-serif
- **Headings**: 24px (h1), 20px (h2), 16px (h3)
- **Body**: 14px
- **Small**: 12px

#### Spacing
- Base unit: 4px
- Margins/Padding: 8px, 16px, 24px, 32px

### Components

#### Navigation Sidebar
- Logo/App name at top
- Nav items with icons
- Active state: blue background with white text

#### Cards
- White background, rounded corners (8px)
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 16px

#### Buttons
- Primary: Blue background (#2563eb), white text
- Secondary: White background, gray border
- Danger: Red background (#ef4444)
- Hover: opacity 0.9
- Disabled: opacity 0.5
- Padding: 8px 16px
- Border radius: 6px

#### Tables
- Header: Gray background (#f1f5f9)
- Rows: Alternating white/gray backgrounds
- Hover: Light blue highlight

#### Forms
- Input fields with border, rounded (6px)
- Focus: Blue border ring
- Labels above inputs
- Error messages in red below inputs

## 5. Functional Specification

### 5.1 Groups Management

#### List Groups
- Display table with columns: Name, Description, Student Count, Actions
- "Add Group" button at top right
- Edit/Delete buttons for each row

#### Create/Edit Group
- Modal dialog
- Fields: Name (required), Description (optional)
- Validation: Name required, max 100 chars

#### Delete Group
- Confirmation dialog
- Warning: Will affect all students in group

### 5.2 Students Management

#### List Students
- Filter by group (dropdown)
- Display table with columns: Name, Email, Group, Actions
- "Add Student" button at top right
- Edit/Delete buttons for each row

#### Create/Edit Student
- Modal dialog
- Fields: Name (required), Email (optional), Group (required dropdown)
- Validation: Name required, email valid if provided

#### Delete Student
- Confirmation dialog

### 5.3 Attendance Taking

#### Take Attendance View
- Select group dropdown
- Select date (defaults to today)
- Display all students in selected group as checklist
- Each student: name + present/absent/late toggle buttons
- "Save Attendance" button

#### View Attendance History
- Select group and date range
- Display attendance records in table format

### 5.4 Dashboard

#### Stats Display
- Total groups count
- Total students count
- Overall attendance percentage

#### Per-Group Statistics
- Bar chart showing attendance % by group
- List of groups with: name, student count, attendance percentage

#### Recent Activity
- List of recent attendance records

## 6. Data Flow

```
UI (React) -> IPC (Electron) -> Main Process -> MySQL Database
                    ^                                    |
                    |<-------- IPC Response -------------|
```

### IPC Channels

- `groups:get-all` -> Get all groups
- `groups:create` -> Create group
- `groups:update` -> Update group
- `groups:delete` -> Delete group
- `students:get-all` -> Get all students (with optional group filter)
- `students:create` -> Create student
- `students:update` -> Update student
- `students:delete` -> Delete student
- `attendance:get-by-date` -> Get attendance for group and date
- `attendance:save` -> Save attendance records
- `attendance:get-stats` -> Get attendance statistics

## 7. Acceptance Criteria

### Groups
- [ ] Can create a new group with name and description
- [ ] Can view list of all groups
- [ ] Can edit existing group
- [ ] Can delete group (with confirmation)
- [ ] Group deletion affects students (set group_id to null or cascade delete based on preference)

### Students
- [ ] Can create a new student with name, email, and group
- [ ] Can view list of all students (filterable by group)
- [ ] Can edit existing student
- [ ] Can delete student
- [ ] Student must belong to a group

### Attendance
- [ ] Can select group and date to take attendance
- [ ] Can mark each student as present, absent, or late
- [ ] Can save attendance records
- [ ] Can view attendance history

### Dashboard
- [ ] Shows total counts (groups, students)
- [ ] Shows attendance percentage per group
- [ ] Displays bar chart of attendance by group

## 8. Project Structure

```
attendance-app/
├── electron/
│   ├── main.ts           # Electron main process
│   ├── preload.ts       # Preload script
│   └── database.ts      # MySQL connection and queries
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── SPEC.md
```