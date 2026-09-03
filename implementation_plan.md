# Smart Campus Management & Route Optimization System
## Full-Stack Implementation Plan
### Java Console → Spring Boot + React + PostgreSQL

---

> [!IMPORTANT]
> **Primary Source of Truth**: `Smart_Campus_Management_Report.pdf` governs all existing functionality, business rules, DSA requirements, OOP structure, role permissions, and access restrictions. Nothing from the original specification is removed or silently altered.

> [!NOTE]
> All decisions **not** explicitly in the report are labeled **[RECOMMENDED]** throughout this document.

---

## Table of Contents

1. [Complete Implementation Roadmap (20 Phases)](#1-complete-implementation-roadmap)
2. [Feature Migration Mapping](#2-feature-migration-mapping)
3. [Complete Spring Boot Architecture](#3-complete-spring-boot-architecture)
4. [PostgreSQL Database Design](#4-postgresql-database-design)
5. [Authentication & RBAC System](#5-authentication--rbac-system)
6. [Complete REST API Specification](#6-complete-rest-api-specification)
7. [Admin Backend Implementation](#7-admin-backend-implementation)
8. [Student Backend Implementation](#8-student-backend-implementation)
9. [Visitor Backend Implementation](#9-visitor-backend-implementation)
10. [DSA Implementation Details](#10-dsa-implementation-details)
11. [Search System Design](#11-search-system-design)
12. [Route Finder Design](#12-route-finder-design)
13. [React Frontend Architecture](#13-react-frontend-architecture)
14. [Reusable Frontend Components](#14-reusable-frontend-components)
15. [Frontend Routing & Role-Based Authorization](#15-frontend-routing--role-based-authorization)
16. [State Management Strategy](#16-state-management-strategy)
17. [UI/UX Requirements](#17-uiux-requirements)
18. [Validation & Error Handling](#18-validation--error-handling)
19. [Testing Strategy](#19-testing-strategy)
20. [Deployment Strategy](#20-deployment-strategy)
21. [Non-Functional Requirements](#21-non-functional-requirements)
22. [Development Commands Reference](#22-development-commands-reference)
23. [Implementation Checklist](#23-implementation-checklist)
24. [Recommended Implementation Order](#24-recommended-implementation-order)

---

## 1. Complete Implementation Roadmap

### Phase 1 — Project Scaffold & Environment Setup
**Objective**: Create both backend and frontend project skeletons with version control.

**Files/Classes to Create**:
- `smart-campus-backend/` — Spring Boot Maven project
- `smart-campus-frontend/` — React application
- `docker-compose.yml` — Orchestration
- `.gitignore`, `README.md`

**Required Dependencies** (pom.xml):
```xml
<dependencies>
  <dependency><!-- Spring Web --></dependency>
  <dependency><!-- Spring Data JPA --></dependency>
  <dependency><!-- Spring Security --></dependency>
  <dependency><!-- PostgreSQL Driver --></dependency>
  <dependency><!-- Flyway Core --></dependency>
  <dependency><!-- JJWT API/Impl/Jackson --></dependency>
  <dependency><!-- Lombok --></dependency>
  <dependency><!-- Spring Boot Validation --></dependency>
  <dependency><!-- Spring Boot Test --></dependency>
</dependencies>
```

**Implementation Tasks**:
1. Generate Spring Boot project via `start.spring.io` with Java 17, Maven
2. Configure `application.yml` with DB connection, JWT secret, server port
3. Scaffold React with `npx create-react-app smart-campus-frontend`
4. Install React dependencies: `react-router-dom`, `axios`, `react-hook-form`
5. Create Docker files and `docker-compose.yml`
6. Initialize Git repository

**Expected Output**: Both projects compile and start without errors.

**Testing Before Proceeding**: `mvn spring-boot:run` starts on port 8080; `npm start` starts on port 3000.

---

### Phase 2 — PostgreSQL Schema & Flyway Migrations
**Objective**: Create normalized database schema with all required tables.

**Files to Create**:
- `src/main/resources/db/migration/V1__create_users_roles.sql`
- `src/main/resources/db/migration/V2__create_campus_entities.sql`
- `src/main/resources/db/migration/V3__create_routes_timetable.sql`
- `src/main/resources/db/migration/V4__create_indexes.sql`
- `src/main/resources/db/migration/V5__seed_admin.sql`

**Implementation Tasks**:
1. Define all table DDL (see Section 4 for full schema)
2. Add foreign key constraints and referential integrity rules
3. Create indexes on search fields
4. Seed default admin account
5. Run migrations via Flyway auto-run on startup

**Expected Output**: Database with all tables, constraints, and seed data.

**Testing Before Proceeding**: `SHOW TABLES` equivalent, verify all FK constraints, seed admin login works.

---

### Phase 3 — Domain Model & Entity Classes
**Objective**: Implement OOP class hierarchy preserving Encapsulation, Inheritance, Abstraction, Polymorphism.

**Files/Classes to Create**:
- `model/User.java` — Abstract base class
- `model/Admin.java` — Extends User
- `model/Student.java` — Extends User
- `model/Visitor.java` — Extends User
- `model/Location.java`
- `model/Department.java`
- `model/Facility.java`
- `model/Route.java`
- `model/Operations.java`
- `model/Timetable.java`
- `model/RefreshToken.java`

**Implementation Tasks**:
1. Implement abstract `User` class with JPA `@Inheritance`
2. Implement role-specific subclasses
3. Apply JPA annotations: `@Entity`, `@Table`, `@Column`, `@OneToMany`, etc.
4. Use Lombok `@Data`, `@Builder`, `@NoArgsConstructor` for boilerplate reduction
5. Implement `UserDetails` interface on `User` for Spring Security

**Expected Output**: All entities compile, JPA schema validates against Flyway migrations.

**Dependencies**: Phase 2

---

### Phase 4 — Repository Layer
**Objective**: Create all `JpaRepository` interfaces for data access.

**Files to Create**:
- `repository/UserRepository.java`
- `repository/AdminRepository.java`
- `repository/StudentRepository.java`
- `repository/VisitorRepository.java`
- `repository/LocationRepository.java`
- `repository/DepartmentRepository.java`
- `repository/FacilityRepository.java`
- `repository/RouteRepository.java`
- `repository/OperationsRepository.java`
- `repository/TimetableRepository.java`
- `repository/RefreshTokenRepository.java`

**Implementation Tasks**:
1. Extend `JpaRepository<Entity, Long>`
2. Add custom query methods: `findByUserId()`, `findByName()`, search queries with `@Query`
3. Add duplicate-check methods: `existsByStudentId()`, `existsByAdminId()`
4. Add case-insensitive search: `findByNameContainingIgnoreCase()`

**Expected Output**: All repositories available as Spring beans.

**Dependencies**: Phase 3

---

### Phase 5 — DTOs & Mappers
**Objective**: Define all Data Transfer Objects for clean API contracts.

**Files to Create**:
- `dto/auth/LoginRequest.java`, `LoginResponse.java`
- `dto/auth/TokenRefreshRequest.java`, `TokenRefreshResponse.java`
- `dto/user/AdminDTO.java`, `StudentDTO.java`, `VisitorDTO.java`
- `dto/user/CreateUserRequest.java`, `UpdateUserRequest.java`
- `dto/campus/LocationDTO.java`, `CreateLocationRequest.java`
- `dto/campus/DepartmentDTO.java`, `CreateDepartmentRequest.java`
- `dto/campus/FacilityDTO.java`, `CreateFacilityRequest.java`
- `dto/campus/RouteDTO.java`, `CreateRouteRequest.java`
- `dto/campus/OperationsDTO.java`
- `dto/campus/TimetableDTO.java`
- `dto/route/RouteFinderRequest.java`, `RouteFinderResponse.java`
- `dto/common/ApiResponse.java`, `ErrorResponse.java`
- `mapper/UserMapper.java`, `CampusMapper.java`

**Implementation Tasks**:
1. Define all DTOs with validation annotations (`@NotBlank`, `@NotNull`, `@Size`, `@Min`)
2. Implement mapper classes (or use MapStruct **[RECOMMENDED]**)
3. Define standard `ApiResponse<T>` wrapper

**Expected Output**: All DTOs compile with validation annotations applied.

**Dependencies**: Phase 3

---

### Phase 6 — JWT Security Infrastructure
**Objective**: Implement JWT-based authentication with Spring Security.

**Files to Create**:
- `security/JwtTokenProvider.java`
- `security/JwtAuthenticationFilter.java`
- `security/CustomUserDetailsService.java`
- `security/SecurityConfig.java`
- `security/RoleBasedAccessControl.java`
- `config/SecurityConfig.java`

**Implementation Tasks**:
1. Implement token generation (`HS256`, 24h expiry **[RECOMMENDED]**)
2. Implement token validation and claim extraction
3. Implement `JwtAuthenticationFilter` extending `OncePerRequestFilter`
4. Configure `SecurityFilterChain` with public and protected routes
5. Implement role-based `@PreAuthorize` annotations
6. Configure CORS for React frontend origin

**Expected Output**: Security config loads; public endpoints accessible without token; protected endpoints return 401 without token.

**Dependencies**: Phase 3, Phase 5

---

### Phase 7 — Authentication Service & Controller
**Objective**: Implement login, logout, and token refresh for all roles.

**Files to Create**:
- `service/AuthService.java`
- `service/RefreshTokenService.java`
- `controller/AuthController.java`

**Implementation Tasks**:
1. Implement `login()` — validate credentials, return JWT + refresh token
2. Implement `refreshToken()` — validate refresh token, issue new JWT
3. Implement `logout()` — invalidate refresh token in DB
4. Handle Visitor entry (no credentials — name-based session **[RECOMMENDED]**)
5. Write integration tests for all auth flows

**Expected Output**: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout` endpoints work for Admin and Student; Visitor entry endpoint works.

**Dependencies**: Phase 6

---

### Phase 8 — DSA Core: Graph, BFS, Dijkstra
**Objective**: Implement all required data structures and algorithms.

**Files to Create**:
- `dsa/CampusGraph.java`
- `dsa/GraphNode.java`
- `dsa/GraphEdge.java`
- `dsa/BFSTraversal.java`
- `dsa/DijkstraAlgorithm.java`
- `dsa/RouteEngine.java`

**Implementation Tasks**:
1. Build adjacency-list graph (`HashMap<String, List<GraphEdge>>`)
2. Implement BFS for connectivity check (uses `Queue<String>`)
3. Implement Dijkstra with `PriorityQueue<GraphNode>` (Comparable by distance)
4. Implement `RouteEngine` that loads locations/routes from DB into graph at startup
5. Write unit tests for BFS and Dijkstra with known graphs
6. Handle edge cases: disconnected nodes, self-loops, missing nodes

**Expected Output**: `RouteEngine.findShortestPath(sourceId, destId)` returns ordered location list + total distance.

**Dependencies**: Phase 4

---

### Phase 9 — Admin Service Layer
**Objective**: Implement all admin CRUD operations with full validation.

**Files to Create**:
- `service/AdminService.java`
- `service/LocationService.java`
- `service/DepartmentService.java`
- `service/FacilityService.java`
- `service/RouteService.java`
- `service/OperationsService.java`
- `service/StudentManagementService.java`

**Implementation Tasks**:
1. Implement CRUD for Locations, Departments, Facilities, Routes, Operations
2. Implement Admin and Student account management (create, update, delete)
3. Add duplicate ID validation using `HashMap` for O(1) checks + DB constraint
4. Add comprehensive input validation
5. Propagate route changes to graph via `RouteEngine`

**Expected Output**: All admin service methods pass unit tests.

**Dependencies**: Phase 4, Phase 5, Phase 8

---

### Phase 10 — Admin REST Controllers
**Objective**: Expose all admin operations as secured REST endpoints.

**Files to Create**:
- `controller/AdminController.java`
- `controller/LocationController.java`
- `controller/DepartmentController.java`
- `controller/FacilityController.java`
- `controller/RouteController.java`
- `controller/OperationsController.java`
- `controller/TimetableController.java`

**Implementation Tasks**:
1. Map all service methods to `@RestController` endpoints
2. Apply `@PreAuthorize("hasRole('ADMIN')")` to all admin endpoints
3. Use `@Valid` on all request bodies
4. Return standardized `ApiResponse<T>` wrappers
5. Write REST API integration tests

**Expected Output**: All admin endpoints return correct responses; unauthorized requests return 403.

**Dependencies**: Phase 6, Phase 9

---

### Phase 11 — Student & Visitor Service & Controllers
**Objective**: Implement read-only student endpoints and visitor public access.

**Files to Create**:
- `service/StudentService.java`
- `service/VisitorService.java`
- `controller/StudentController.java`
- `controller/VisitorController.java`
- `controller/PublicController.java`

**Implementation Tasks**:
1. Student: view profile, view campus data, search, route finder, view own timetable
2. Visitor: name-based entry, view public campus data, search, route finder
3. Enforce read-only — no create/update/delete in student/visitor services
4. Restrict student access to own timetable (no other student data)

**Expected Output**: Student/visitor endpoints return data; any write attempt returns 403.

**Dependencies**: Phase 9, Phase 10

---

### Phase 12 — Search System
**Objective**: Implement comprehensive search across all campus entities.

**Files to Create**:
- `service/SearchService.java`
- `controller/SearchController.java`

**Implementation Tasks**:
1. Implement case-insensitive partial-match search using JPQL `LIKE`
2. Support searching Locations, Departments, Facilities by name/description
3. Accessible to Admin, Student, and Visitor (with appropriate data scoping)
4. Return structured results with entity type labels

**Expected Output**: `GET /api/search?query=eng&type=location` returns matching locations.

**Dependencies**: Phase 9

---

### Phase 13 — Exception Handling
**Objective**: Implement global exception handling with consistent error responses.

**Files to Create**:
- `exception/ResourceNotFoundException.java`
- `exception/DuplicateIdException.java`
- `exception/InvalidRouteException.java`
- `exception/UnauthorizedAccessException.java`
- `exception/InvalidCredentialsException.java`
- `exception/GlobalExceptionHandler.java`

**Implementation Tasks**:
1. Define custom exceptions for all error scenarios
2. Implement `@RestControllerAdvice` global handler
3. Map exceptions to HTTP status codes (404, 409, 400, 401, 403)
4. Return consistent `ErrorResponse` JSON structure

**Expected Output**: All error scenarios return consistent JSON error objects.

**Dependencies**: Phase 5

---

### Phase 14 — React Foundation & Auth Pages
**Objective**: Build React project structure, routing, auth context, and login pages.

**Files to Create**:
- `src/context/AuthContext.jsx`
- `src/hooks/useAuth.js`
- `src/services/apiClient.js` (Axios instance)
- `src/services/authService.js`
- `src/routes/AppRouter.jsx`
- `src/routes/ProtectedRoute.jsx`
- `src/pages/public/LoginPage.jsx`
- `src/pages/public/LandingPage.jsx`
- `src/pages/public/VisitorEntryPage.jsx`

**Implementation Tasks**:
1. Configure Axios with base URL and JWT interceptor (auto-attach token)
2. Implement `AuthContext` with login/logout/role state
3. Implement `ProtectedRoute` with role validation and redirect
4. Build Login page with role-selector (Admin/Student) and Visitor entry
5. Connect login form to auth API

**Expected Output**: Login works for Admin and Student; Visitor entry navigates to visitor dashboard.

**Dependencies**: Phase 7

---

### Phase 15 — Admin Frontend Pages
**Objective**: Build all admin dashboard and CRUD pages.

**Files to Create**:
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/ManageLocations.jsx`
- `src/pages/admin/ManageDepartments.jsx`
- `src/pages/admin/ManageFacilities.jsx`
- `src/pages/admin/ManageRoutes.jsx`
- `src/pages/admin/ManageOperations.jsx`
- `src/pages/admin/ManageStudents.jsx`
- `src/pages/admin/ManageAdmins.jsx`
- `src/pages/admin/ManageTimetable.jsx`

**Implementation Tasks**:
1. Build data tables with pagination, sorting, filtering
2. Build create/edit modals with validated forms
3. Build delete confirmation dialogs
4. Connect all pages to API services
5. Display success/error notifications (toast)

**Expected Output**: Admin can perform all CRUD operations from UI.

**Dependencies**: Phase 10, Phase 14

---

### Phase 16 — Student Frontend Pages
**Objective**: Build all student read-only pages.

**Files to Create**:
- `src/pages/student/StudentDashboard.jsx`
- `src/pages/student/SearchPage.jsx`
- `src/pages/student/RouteFinderPage.jsx`
- `src/pages/student/TimetablePage.jsx`
- `src/pages/student/ProfilePage.jsx`

**Implementation Tasks**:
1. Build campus info views (Locations, Departments, Facilities)
2. Build search with real-time results
3. Build route finder with location dropdowns and result display
4. Build timetable view (grid/table format)
5. No write operations permitted in UI

**Expected Output**: Student can view/search campus data and find routes.

**Dependencies**: Phase 11, Phase 14

---

### Phase 17 — Visitor Frontend Pages
**Objective**: Build visitor public-access pages.

**Files to Create**:
- `src/pages/visitor/VisitorDashboard.jsx`
- `src/pages/visitor/SearchPage.jsx`
- `src/pages/visitor/RouteFinderPage.jsx`

**Implementation Tasks**:
1. Mirror student search and route finder (no timetable, no private data)
2. Visitor session management (name stored in context, not persisted in DB)
3. Clean exit/logout flow

**Expected Output**: Visitor can access public campus info and route finder.

**Dependencies**: Phase 11, Phase 14

---

### Phase 18 — Reusable Components Library
**Objective**: Extract and finalize all reusable UI components.

**Files to Create** (see Section 14 for full list):
- `components/layout/Navbar.jsx`, `Sidebar.jsx`
- `components/ui/DataTable.jsx`, `Modal.jsx`, `SearchBar.jsx`
- `components/ui/LoadingSpinner.jsx`, `ErrorMessage.jsx`, `SuccessToast.jsx`
- `components/campus/LocationCard.jsx`, `DepartmentCard.jsx`, `FacilityCard.jsx`
- `components/route/RouteFinder.jsx`
- `components/timetable/TimetableGrid.jsx`

**Implementation Tasks**:
1. Refactor inline JSX into reusable components
2. Define PropTypes or TypeScript interfaces **[RECOMMENDED: PropTypes for JS]**
3. Ensure components are independently testable

**Expected Output**: All components documented and reusable across pages.

**Dependencies**: Phase 15, Phase 16, Phase 17

---

### Phase 19 — Testing & QA
**Objective**: Implement comprehensive test coverage.

**Files to Create**:
- `src/test/java/com/smartcampus/service/*Test.java`
- `src/test/java/com/smartcampus/controller/*ControllerTest.java`
- `src/test/java/com/smartcampus/dsa/*Test.java`
- `src/test/java/com/smartcampus/security/*Test.java`
- `src/test/__tests__/components/*.test.jsx`

**Implementation Tasks**:
1. Write unit tests for all service methods
2. Write DSA tests (BFS, Dijkstra, edge cases)
3. Write REST API tests with MockMvc
4. Write RBAC tests (each role attempting unauthorized actions)
5. Write frontend component tests with React Testing Library

**Expected Output**: Test suite passes with >80% coverage on critical paths.

**Dependencies**: Phase 8 through 18

---

### Phase 20 — Docker & Deployment Configuration
**Objective**: Containerize and prepare for deployment.

**Files to Create**:
- `smart-campus-backend/Dockerfile`
- `smart-campus-frontend/Dockerfile`
- `docker-compose.yml`
- `.env.example`
- `nginx.conf` (frontend reverse proxy)
- `.github/workflows/ci.yml`

**Implementation Tasks**:
1. Write multi-stage Dockerfiles for backend (JDK 17) and frontend (Node 18 + Nginx)
2. Compose PostgreSQL + backend + frontend services
3. Configure environment variables
4. Set up GitHub Actions CI pipeline
5. Document deployment steps in README

**Expected Output**: `docker-compose up` starts the entire application stack.

**Dependencies**: All previous phases

---

## 2. Feature Migration Mapping

| Console Feature | Java Backend Component | REST API Endpoint | React Page/Component | PostgreSQL Table | Reuse Status |
|---|---|---|---|---|---|
| Login (Admin) | `AuthService.login()` | `POST /api/auth/login` | `LoginPage.jsx` | `users`, `admins` | Modify logic, replace console I/O |
| Login (Student) | `AuthService.login()` | `POST /api/auth/login` | `LoginPage.jsx` | `users`, `students` | Modify logic, replace console I/O |
| Visitor Entry | `VisitorService.enter()` | `POST /api/auth/visitor` | `VisitorEntryPage.jsx` | `visitors` (session) | Replace: name entry to API call |
| Add Admin | `AdminService.createAdmin()` | `POST /api/admin/admins` | `ManageAdmins.jsx` | `admins` | Reuse validation logic |
| Add Student | `StudentManagementService.create()` | `POST /api/admin/students` | `ManageStudents.jsx` | `students` | Reuse validation logic |
| Delete Admin | `AdminService.deleteAdmin()` | `DELETE /api/admin/admins/{id}` | `ManageAdmins.jsx` | `admins` | Reuse |
| Delete Student | `StudentManagementService.delete()` | `DELETE /api/admin/students/{id}` | `ManageStudents.jsx` | `students` | Reuse |
| Add Location | `LocationService.create()` | `POST /api/admin/locations` | `ManageLocations.jsx` | `locations` | Reuse; add graph sync |
| Edit Location | `LocationService.update()` | `PUT /api/admin/locations/{id}` | `ManageLocations.jsx` | `locations` | New (console had no edit) |
| Delete Location | `LocationService.delete()` | `DELETE /api/admin/locations/{id}` | `ManageLocations.jsx` | `locations` | Reuse; cascade route cleanup |
| View Locations | `LocationService.getAll()` | `GET /api/locations` | `LocationCard.jsx` | `locations` | Replace console print |
| Search Locations | `SearchService.searchLocations()` | `GET /api/search?type=location&q=` | `SearchBar.jsx` | `locations` | Replace: console scan → API |
| Add Department | `DepartmentService.create()` | `POST /api/admin/departments` | `ManageDepartments.jsx` | `departments` | Reuse |
| Edit Department | `DepartmentService.update()` | `PUT /api/admin/departments/{id}` | `ManageDepartments.jsx` | `departments` | New |
| Delete Department | `DepartmentService.delete()` | `DELETE /api/admin/departments/{id}` | `ManageDepartments.jsx` | `departments` | Reuse |
| View Departments | `DepartmentService.getAll()` | `GET /api/departments` | `DepartmentCard.jsx` | `departments` | Replace console print |
| Search Departments | `SearchService.searchDepartments()` | `GET /api/search?type=department&q=` | `SearchBar.jsx` | `departments` | Replace |
| Add Facility | `FacilityService.create()` | `POST /api/admin/facilities` | `ManageFacilities.jsx` | `facilities` | Reuse |
| Edit Facility | `FacilityService.update()` | `PUT /api/admin/facilities/{id}` | `ManageFacilities.jsx` | `facilities` | New |
| Delete Facility | `FacilityService.delete()` | `DELETE /api/admin/facilities/{id}` | `ManageFacilities.jsx` | `facilities` | Reuse |
| View Facilities | `FacilityService.getAll()` | `GET /api/facilities` | `FacilityCard.jsx` | `facilities` | Replace |
| Add Route | `RouteService.create()` | `POST /api/admin/routes` | `ManageRoutes.jsx` | `routes` | Reuse; add graph edge |
| Edit Route | `RouteService.update()` | `PUT /api/admin/routes/{id}` | `ManageRoutes.jsx` | `routes` | New |
| Delete Route | `RouteService.delete()` | `DELETE /api/admin/routes/{id}` | `ManageRoutes.jsx` | `routes` | Reuse; remove graph edge |
| View Routes | `RouteService.getAll()` | `GET /api/routes` | `ManageRoutes.jsx` | `routes` | Replace |
| Add Operations | `OperationsService.create()` | `POST /api/admin/operations` | `ManageOperations.jsx` | `operations` | Reuse |
| Edit Operations | `OperationsService.update()` | `PUT /api/admin/operations/{id}` | `ManageOperations.jsx` | `operations` | New |
| View Operations | `OperationsService.getAll()` | `GET /api/operations` | `ManageOperations.jsx` | `operations` | Replace |
| Add Timetable | `TimetableService.create()` | `POST /api/admin/timetable` | `ManageTimetable.jsx` | `timetables` | Reuse |
| View Timetable (Student) | `TimetableService.getByStudentId()` | `GET /api/student/timetable` | `TimetablePage.jsx` | `timetables` | Restrict to own |
| Find Shortest Route | `RouteEngine.findShortestPath()` | `POST /api/routes/find` | `RouteFinderPage.jsx` | `routes`, `locations` | **DSA preserved** — Dijkstra |
| BFS Connectivity | `BFSTraversal.isReachable()` | Internal call (not direct API) | Displayed on route result | `routes`, `locations` | **DSA preserved** — BFS |
| Duplicate ID Check | `AdminService` + `HashMap` | Returns 409 on duplicates | Form-level error display | Unique constraints | **DSA preserved** |

**Console-Specific Code to Remove**:
- `Scanner` input reading
- `System.out.println()` display logic
- Main menu loops and switch statements
- File-based `.db` persistence
- Console-based session management

---

## 3. Complete Spring Boot Architecture

### Project Structure

```
smart-campus-backend/
└── src/main/java/com/smartcampus/
    ├── SmartCampusApplication.java
    ├── controller/
    │   ├── AuthController.java
    │   ├── AdminController.java
    │   ├── StudentController.java
    │   ├── VisitorController.java
    │   ├── LocationController.java
    │   ├── DepartmentController.java
    │   ├── FacilityController.java
    │   ├── RouteController.java
    │   ├── OperationsController.java
    │   ├── TimetableController.java
    │   ├── SearchController.java
    │   └── PublicController.java
    ├── service/
    │   ├── AuthService.java
    │   ├── RefreshTokenService.java
    │   ├── AdminService.java
    │   ├── StudentService.java
    │   ├── StudentManagementService.java
    │   ├── VisitorService.java
    │   ├── LocationService.java
    │   ├── DepartmentService.java
    │   ├── FacilityService.java
    │   ├── RouteService.java
    │   ├── OperationsService.java
    │   ├── TimetableService.java
    │   └── SearchService.java
    ├── repository/
    │   ├── UserRepository.java
    │   ├── AdminRepository.java
    │   ├── StudentRepository.java
    │   ├── VisitorRepository.java
    │   ├── LocationRepository.java
    │   ├── DepartmentRepository.java
    │   ├── FacilityRepository.java
    │   ├── RouteRepository.java
    │   ├── OperationsRepository.java
    │   ├── TimetableRepository.java
    │   └── RefreshTokenRepository.java
    ├── model/
    │   ├── User.java              ← Abstract base entity
    │   ├── Admin.java             ← Extends User
    │   ├── Student.java           ← Extends User
    │   ├── Visitor.java           ← Extends User (transient session)
    │   ├── Location.java
    │   ├── Department.java
    │   ├── Facility.java
    │   ├── Route.java
    │   ├── Operations.java
    │   ├── Timetable.java
    │   └── RefreshToken.java
    ├── dto/
    │   ├── auth/
    │   │   ├── LoginRequest.java
    │   │   ├── LoginResponse.java
    │   │   ├── VisitorEntryRequest.java
    │   │   ├── TokenRefreshRequest.java
    │   │   └── TokenRefreshResponse.java
    │   ├── user/
    │   │   ├── AdminDTO.java
    │   │   ├── StudentDTO.java
    │   │   ├── CreateAdminRequest.java
    │   │   └── CreateStudentRequest.java
    │   ├── campus/
    │   │   ├── LocationDTO.java, CreateLocationRequest.java
    │   │   ├── DepartmentDTO.java, CreateDepartmentRequest.java
    │   │   ├── FacilityDTO.java, CreateFacilityRequest.java
    │   │   ├── RouteDTO.java, CreateRouteRequest.java
    │   │   ├── OperationsDTO.java, CreateOperationsRequest.java
    │   │   └── TimetableDTO.java, CreateTimetableRequest.java
    │   ├── route/
    │   │   ├── RouteFinderRequest.java
    │   │   └── RouteFinderResponse.java
    │   └── common/
    │       ├── ApiResponse.java
    │       └── ErrorResponse.java
    ├── security/
    │   ├── JwtTokenProvider.java
    │   ├── JwtAuthenticationFilter.java
    │   ├── CustomUserDetailsService.java
    │   └── SecurityConfig.java
    ├── dsa/
    │   ├── CampusGraph.java
    │   ├── GraphNode.java
    │   ├── GraphEdge.java
    │   ├── BFSTraversal.java
    │   ├── DijkstraAlgorithm.java
    │   └── RouteEngine.java
    ├── exception/
    │   ├── ResourceNotFoundException.java
    │   ├── DuplicateIdException.java
    │   ├── InvalidRouteException.java
    │   ├── UnauthorizedAccessException.java
    │   ├── InvalidCredentialsException.java
    │   └── GlobalExceptionHandler.java
    ├── config/
    │   ├── AppConfig.java
    │   ├── CorsConfig.java
    │   └── FlywayConfig.java
    └── util/
        ├── ValidationUtil.java
        └── PasswordUtil.java
```

### Critical Class Definitions

#### `User.java` — Abstract Base Class
```java
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
public abstract class User implements UserDetails {
    @Id @GeneratedValue
    private Long id;
    @Column(unique = true, nullable = false)
    private String userId;      // Domain-specific ID (e.g., "A001", "S001")
    @Column(nullable = false)
    private String fullName;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;    // BCrypt hashed
    @Enumerated(EnumType.STRING)
    private Role role;          // ADMIN, STUDENT, VISITOR
    private boolean active = true;
    // Getters/Setters, UserDetails methods (getAuthorities, etc.)
}
```

#### `Admin.java` — Extends User
```java
@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    @Column(nullable = false)
    private String department;
    @Column(nullable = false)
    private String email;
}
```

#### `Student.java` — Extends User
```java
@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
public class Student extends User {
    @Column(nullable = false, unique = true)
    private String studentId;
    @Column(nullable = false)
    private String program;
    @Column(nullable = false)
    private String year;
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Timetable> timetable = new ArrayList<>();
}
```

#### `Location.java`
```java
@Entity
@Table(name = "locations")
public class Location {
    @Id @GeneratedValue
    private Long id;
    @Column(unique = true, nullable = false)
    private String locationId;
    @Column(nullable = false)
    private String name;
    @Column
    private String description;
    @Column
    private String building;
    @Column
    private String floor;
    @Column
    private boolean isPublic = true;
    @OneToMany(mappedBy = "sourceLocation")
    private List<Route> outgoingRoutes = new ArrayList<>();
    @OneToMany(mappedBy = "destinationLocation")
    private List<Route> incomingRoutes = new ArrayList<>();
}
```

#### `Route.java`
```java
@Entity
@Table(name = "routes")
public class Route {
    @Id @GeneratedValue
    private Long id;
    @Column(unique = true, nullable = false)
    private String routeId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_location_id")
    private Location sourceLocation;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_location_id")
    private Location destinationLocation;
    @Column(nullable = false)
    private Double distance;        // Weight for Dijkstra
    @Column
    private String description;
    @Column
    private boolean bidirectional = true;
}
```

#### `CampusGraph.java` — DSA Core
```java
@Component
public class CampusGraph {
    // Adjacency list — locations as vertices, routes as weighted edges
    private final HashMap<String, List<GraphEdge>> adjacencyList = new HashMap<>();
    
    public void addVertex(String locationId) { ... }
    public void addEdge(String source, String dest, double weight, boolean bidirectional) { ... }
    public void removeEdge(String source, String dest) { ... }
    public HashMap<String, List<GraphEdge>> getAdjacencyList() { return adjacencyList; }
}
```

---

## 4. PostgreSQL Database Design

### Schema Overview

```
users (base table)
├── admins (joined)
├── students (joined)
└── visitors (joined)

locations
departments (may reference location)
facilities (references location)
routes (references two locations)
operations
timetables (references student)
refresh_tokens (references user)
```

### Table Definitions

#### `users`
```sql
CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    user_id      VARCHAR(50)  NOT NULL UNIQUE,
    full_name    VARCHAR(100) NOT NULL,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,          -- BCrypt hash
    role         VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','STUDENT','VISITOR')),
    active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_user_id   ON users(user_id);
CREATE INDEX idx_users_username  ON users(username);
CREATE INDEX idx_users_role      ON users(role);
```

#### `admins`
```sql
CREATE TABLE admins (
    id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE
);
```

#### `students`
```sql
CREATE TABLE students (
    id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50)  NOT NULL UNIQUE,
    program    VARCHAR(100) NOT NULL,
    year       VARCHAR(20)  NOT NULL
);
CREATE INDEX idx_students_student_id ON students(student_id);
```

#### `visitors`
```sql
CREATE TABLE visitors (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    entry_time TIMESTAMP    NOT NULL DEFAULT NOW(),
    exit_time  TIMESTAMP
);
```

#### `locations`
```sql
CREATE TABLE locations (
    id            BIGSERIAL PRIMARY KEY,
    location_id   VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    building      VARCHAR(50),
    floor         VARCHAR(20),
    is_public     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_locations_location_id ON locations(location_id);
CREATE INDEX idx_locations_name        ON locations(name);
```

#### `departments`
```sql
CREATE TABLE departments (
    id              BIGSERIAL PRIMARY KEY,
    department_id   VARCHAR(50)  NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    head_of_dept    VARCHAR(100),
    location_id     BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_departments_name ON departments(name);
```

#### `facilities`
```sql
CREATE TABLE facilities (
    id            BIGSERIAL PRIMARY KEY,
    facility_id   VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    facility_type VARCHAR(50),
    location_id   BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    is_available  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_facilities_name ON facilities(name);
```

#### `routes`
```sql
CREATE TABLE routes (
    id                      BIGSERIAL PRIMARY KEY,
    route_id                VARCHAR(50) NOT NULL UNIQUE,
    source_location_id      BIGINT      NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    destination_location_id BIGINT      NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    distance                DECIMAL(10,2) NOT NULL CHECK (distance > 0),
    description             TEXT,
    bidirectional           BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_no_self_loop CHECK (source_location_id != destination_location_id)
);
CREATE INDEX idx_routes_source ON routes(source_location_id);
CREATE INDEX idx_routes_dest   ON routes(destination_location_id);
```

#### `operations`
```sql
CREATE TABLE operations (
    id             BIGSERIAL PRIMARY KEY,
    operation_id   VARCHAR(50)  NOT NULL UNIQUE,
    name           VARCHAR(100) NOT NULL,
    description    TEXT,
    status         VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    location_id    BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    operating_hours VARCHAR(100),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

#### `timetables`
```sql
CREATE TABLE timetables (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT      NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject     VARCHAR(100) NOT NULL,
    day_of_week VARCHAR(20)  NOT NULL CHECK (day_of_week IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY')),
    start_time  TIME         NOT NULL,
    end_time    TIME         NOT NULL,
    location_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    instructor  VARCHAR(100),
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);
CREATE INDEX idx_timetable_student ON timetables(student_id);
```

#### `refresh_tokens`
```sql
CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP   NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user   ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token  ON refresh_tokens(token);
```

### ER Diagram (Text Format)

```
USERS (id PK, user_id UNIQUE, username UNIQUE, password, role, active)
  |
  |--< ADMINS (id FK→users.id, department, email UNIQUE)
  |
  |--< STUDENTS (id FK→users.id, student_id UNIQUE, program, year)
  |       |
  |       |--< TIMETABLES (id, student_id FK→students.id, subject, day_of_week,
  |                        start_time, end_time, location_id FK→locations.id)
  |
  |--< REFRESH_TOKENS (id, user_id FK→users.id, token UNIQUE, expiry_date)

LOCATIONS (id PK, location_id UNIQUE, name, description, building, floor, is_public)
  |
  |--< ROUTES (id PK, route_id UNIQUE,
  |            source_location_id FK→locations.id,
  |            destination_location_id FK→locations.id,
  |            distance, bidirectional)
  |
  |--< DEPARTMENTS (id PK, department_id UNIQUE, name, location_id FK→locations.id)
  |
  |--< FACILITIES (id PK, facility_id UNIQUE, name, facility_type,
  |                location_id FK→locations.id, is_available)
  |
  |--< OPERATIONS (id PK, operation_id UNIQUE, name, status,
                   location_id FK→locations.id)

VISITORS (id PK, name, entry_time, exit_time)
```

### Migration Strategy
1. Export existing `.db` data to CSV using existing Java code
2. Write `V6__migrate_legacy_data.sql` to bulk-import CSV data
3. Validate row counts and referential integrity post-migration
4. Keep legacy `.db` as backup until validation is complete

---

## 5. Authentication & RBAC System

### JWT Token Flow

```
1. Client sends POST /api/auth/login { username, password, role }
2. AuthService validates credentials (BCrypt compare)
3. On success: generate JWT (access token, 24h) + Refresh Token (7d, stored in DB)
4. Return { accessToken, refreshToken, role, userId }
5. Client stores tokens [RECOMMENDED: localStorage for accessToken]
6. All subsequent requests: Authorization: Bearer <accessToken>
7. JwtAuthenticationFilter intercepts and validates token
8. On 401: client calls POST /api/auth/refresh { refreshToken }
9. On logout: DELETE /api/auth/logout (invalidates refresh token in DB)
```

### Password Hashing
- Algorithm: **BCrypt** with strength 12 **[RECOMMENDED]**
- Implementation: `BCryptPasswordEncoder` (Spring Security)
- Seed admin password hashed during Flyway V5 migration

### Visitor Authentication
- No credentials required
- POST `/api/auth/visitor` with `{ name }` 
- Returns a limited-scope JWT token with role `VISITOR`
- Visitor session stored in `visitors` table

### Permission Matrix

| Feature | Admin | Student | Visitor |
|---|:---:|:---:|:---:|
| Login with credentials | ✅ | ✅ | ❌ |
| Visitor entry (name only) | ❌ | ❌ | ✅ |
| View all locations | ✅ | ✅ | ✅ |
| View departments | ✅ | ✅ | ✅ |
| View facilities | ✅ | ✅ | ✅ |
| View operations | ✅ | ✅ | ✅ |
| Search campus data | ✅ | ✅ | ✅ |
| Find routes (Dijkstra) | ✅ | ✅ | ✅ |
| Create locations | ✅ | ❌ | ❌ |
| Update locations | ✅ | ❌ | ❌ |
| Delete locations | ✅ | ❌ | ❌ |
| Manage departments | ✅ | ❌ | ❌ |
| Manage facilities | ✅ | ❌ | ❌ |
| Manage routes | ✅ | ❌ | ❌ |
| Manage operations | ✅ | ❌ | ❌ |
| Create admin accounts | ✅ | ❌ | ❌ |
| Create student accounts | ✅ | ❌ | ❌ |
| Delete admin accounts | ✅ | ❌ | ❌ |
| Delete student accounts | ✅ | ❌ | ❌ |
| View all student profiles | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ❌ |
| View own timetable | N/A | ✅ | ❌ |
| Manage student timetables | ✅ | ❌ | ❌ |
| View private student data | ✅ | ❌ | ❌ |

### Spring Security RBAC Enforcement

```java
// Controller-level enforcement
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> createLocation(...) { ... }

@PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'VISITOR')")
public ResponseEntity<?> getLocations(...) { ... }

@PreAuthorize("hasRole('STUDENT') and #userId == authentication.principal.userId")
public ResponseEntity<?> getMyTimetable(@PathVariable String userId) { ... }
```

---

## 6. Complete REST API Specification

### Standard Response Formats

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ID",
    "message": "Student with ID S001 already exists",
    "field": "studentId"
  }
}
```

### Standard HTTP Status Codes
- `200 OK` — Successful GET, PUT, PATCH
- `201 Created` — Successful POST (new resource)
- `204 No Content` — Successful DELETE
- `400 Bad Request` — Validation failure
- `401 Unauthorized` — Missing or invalid token
- `403 Forbidden` — Insufficient role
- `404 Not Found` — Resource not found
- `409 Conflict` — Duplicate ID or constraint violation
- `500 Internal Server Error` — Unexpected server error

---

### Authentication Endpoints

#### `POST /api/auth/login`
- **Auth**: None
- **Request**: `{ "username": "admin1", "password": "pass123" }`
- **Response 200**: `{ "success": true, "data": { "accessToken": "...", "refreshToken": "...", "role": "ADMIN", "userId": "A001" } }`
- **Response 401**: Invalid credentials
- **Validation**: username and password required, non-empty

#### `POST /api/auth/visitor`
- **Auth**: None
- **Request**: `{ "name": "John Doe" }`
- **Response 200**: `{ "success": true, "data": { "accessToken": "...", "role": "VISITOR", "visitorId": 1, "name": "John Doe" } }`
- **Validation**: name required, 2–100 chars

#### `POST /api/auth/refresh`
- **Auth**: None
- **Request**: `{ "refreshToken": "..." }`
- **Response 200**: `{ "success": true, "data": { "accessToken": "...", "refreshToken": "..." } }`
- **Response 401**: Expired or invalid refresh token

#### `POST /api/auth/logout`
- **Auth**: Bearer token (any role)
- **Request**: `{ "refreshToken": "..." }`
- **Response 200**: `{ "success": true, "message": "Logged out successfully" }`

---

### Admin — Account Management Endpoints

#### `GET /api/admin/admins`
- **Auth**: ADMIN
- **Response 200**: `{ "success": true, "data": [{ "id": 1, "userId": "A001", "fullName": "...", "department": "..." }] }`

#### `POST /api/admin/admins`
- **Auth**: ADMIN
- **Request**: `{ "userId": "A002", "fullName": "Jane Doe", "username": "jane", "password": "secure123", "department": "IT", "email": "jane@campus.edu" }`
- **Response 201**: Created admin DTO
- **Response 409**: `{ "error": { "code": "DUPLICATE_ID", "message": "Admin with ID A002 already exists" } }`
- **Validation**: All fields required; userId unique; email format; password min 6 chars

#### `PUT /api/admin/admins/{id}`
- **Auth**: ADMIN
- **Request**: Partial update fields (except userId)
- **Response 200**: Updated admin DTO

#### `DELETE /api/admin/admins/{id}`
- **Auth**: ADMIN
- **Response 204**: No content
- **Response 404**: Admin not found

#### `GET /api/admin/students`
- **Auth**: ADMIN
- **Response 200**: List of all student DTOs

#### `POST /api/admin/students`
- **Auth**: ADMIN
- **Request**: `{ "studentId": "S001", "fullName": "...", "username": "...", "password": "...", "program": "CS", "year": "2" }`
- **Response 201**: Created student DTO
- **Response 409**: Duplicate student ID

#### `PUT /api/admin/students/{id}`
- **Auth**: ADMIN
- **Response 200**: Updated student DTO

#### `DELETE /api/admin/students/{id}`
- **Auth**: ADMIN — cascades deletion of timetable entries
- **Response 204**: No content

---

### Campus Entity Endpoints

#### Locations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/locations` | ANY | Get all locations |
| GET | `/api/locations/{locationId}` | ANY | Get location by ID |
| POST | `/api/admin/locations` | ADMIN | Create location |
| PUT | `/api/admin/locations/{locationId}` | ADMIN | Update location |
| DELETE | `/api/admin/locations/{locationId}` | ADMIN | Delete location |

**POST /api/admin/locations Request**:
```json
{
  "locationId": "LOC001",
  "name": "Engineering Block A",
  "description": "Main engineering faculty building",
  "building": "Block A",
  "floor": "Ground",
  "isPublic": true
}
```

#### Departments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/departments` | ANY | Get all departments |
| GET | `/api/departments/{departmentId}` | ANY | Get department by ID |
| POST | `/api/admin/departments` | ADMIN | Create department |
| PUT | `/api/admin/departments/{departmentId}` | ADMIN | Update department |
| DELETE | `/api/admin/departments/{departmentId}` | ADMIN | Delete department |

#### Facilities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/facilities` | ANY | Get all facilities |
| GET | `/api/facilities/{facilityId}` | ANY | Get facility by ID |
| POST | `/api/admin/facilities` | ADMIN | Create facility |
| PUT | `/api/admin/facilities/{facilityId}` | ADMIN | Update facility |
| DELETE | `/api/admin/facilities/{facilityId}` | ADMIN | Delete facility |

#### Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/routes` | ANY | Get all routes |
| GET | `/api/routes/{routeId}` | ANY | Get route by ID |
| POST | `/api/admin/routes` | ADMIN | Create route (adds graph edge) |
| PUT | `/api/admin/routes/{routeId}` | ADMIN | Update route |
| DELETE | `/api/admin/routes/{routeId}` | ADMIN | Delete route (removes graph edge) |
| POST | `/api/routes/find` | ANY (authenticated) | Find shortest path |

**POST /api/routes/find Request**:
```json
{ "sourceLocationId": "LOC001", "destinationLocationId": "LOC005" }
```
**Response 200**:
```json
{
  "success": true,
  "data": {
    "path": ["LOC001", "LOC003", "LOC005"],
    "pathNames": ["Engineering Block A", "Central Hub", "Library"],
    "totalDistance": 450.5,
    "reachable": true,
    "algorithm": "Dijkstra"
  }
}
```
**Response 200 (no path)**:
```json
{
  "success": true,
  "data": { "reachable": false, "message": "No path exists between selected locations" }
}
```

#### Operations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/operations` | ANY | Get all operations |
| POST | `/api/admin/operations` | ADMIN | Create operation |
| PUT | `/api/admin/operations/{operationId}` | ADMIN | Update operation |
| DELETE | `/api/admin/operations/{operationId}` | ADMIN | Delete operation |

#### Timetable

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/student/timetable` | STUDENT | Get own timetable |
| POST | `/api/admin/timetable` | ADMIN | Add timetable entry |
| PUT | `/api/admin/timetable/{id}` | ADMIN | Update timetable entry |
| DELETE | `/api/admin/timetable/{id}` | ADMIN | Delete timetable entry |

### Search Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/search?query=lib&type=location` | ANY (auth) | Search locations |
| GET | `/api/search?query=cs&type=department` | ANY (auth) | Search departments |
| GET | `/api/search?query=lab&type=facility` | ANY (auth) | Search facilities |
| GET | `/api/search?query=eng` | ANY (auth) | Search all entity types |

**Query Parameters**:
- `query` (required): Search string, min 1 char
- `type` (optional): `location`, `department`, `facility`, `all`
- `page` (optional, default 0): Pagination
- `size` (optional, default 20): Page size

---

## 7. Admin Backend Implementation

### LocationService — Full CRUD

```java
@Service
@Transactional
public class LocationService {

    // CREATE — with duplicate ID check
    public LocationDTO createLocation(CreateLocationRequest req) {
        if (locationRepository.existsByLocationId(req.getLocationId())) {
            throw new DuplicateIdException("DUPLICATE_ID", 
                "Location with ID " + req.getLocationId() + " already exists", "locationId");
        }
        Location location = mapper.toEntity(req);
        Location saved = locationRepository.save(location);
        campusGraph.addVertex(saved.getLocationId()); // Sync graph
        return mapper.toDTO(saved);
    }

    // READ ALL
    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
            .map(mapper::toDTO).collect(Collectors.toList());
    }

    // READ ONE
    public LocationDTO getLocationById(String locationId) {
        return locationRepository.findByLocationId(locationId)
            .map(mapper::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + locationId));
    }

    // UPDATE
    public LocationDTO updateLocation(String locationId, CreateLocationRequest req) {
        Location existing = locationRepository.findByLocationId(locationId)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + locationId));
        mapper.updateEntity(existing, req);
        return mapper.toDTO(locationRepository.save(existing));
    }

    // DELETE — cascade routes
    public void deleteLocation(String locationId) {
        Location location = locationRepository.findByLocationId(locationId)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + locationId));
        campusGraph.removeVertex(locationId); // Sync graph
        locationRepository.delete(location);
    }
}
```

**Validation Rules** (applied at DTO level via Bean Validation):
- `locationId`: Required, 1–50 chars, alphanumeric + underscore
- `name`: Required, 1–100 chars
- `description`: Optional, max 500 chars
- `building`: Optional, max 50 chars
- `floor`: Optional, max 20 chars

**Same pattern applies to**: DepartmentService, FacilityService, RouteService, OperationsService

### RouteService — Graph Synchronization

```java
@Service
public class RouteService {
    public RouteDTO createRoute(CreateRouteRequest req) {
        // Validate: source and destination locations exist
        Location source = locationRepository.findByLocationId(req.getSourceLocationId())
            .orElseThrow(() -> new ResourceNotFoundException("Source location not found"));
        Location dest = locationRepository.findByLocationId(req.getDestinationLocationId())
            .orElseThrow(() -> new ResourceNotFoundException("Destination location not found"));
        
        // Validate: no self-loop
        if (req.getSourceLocationId().equals(req.getDestinationLocationId())) {
            throw new InvalidRouteException("Source and destination cannot be the same");
        }
        
        // Validate: distance > 0
        if (req.getDistance() <= 0) {
            throw new InvalidRouteException("Distance must be greater than 0");
        }
        
        Route route = mapper.toEntity(req, source, dest);
        Route saved = routeRepository.save(route);
        
        // Sync to in-memory graph
        campusGraph.addEdge(req.getSourceLocationId(), req.getDestinationLocationId(),
            req.getDistance(), req.isBidirectional());
        
        return mapper.toDTO(saved);
    }
}
```

---

## 8. Student Backend Implementation

### StudentService — Read-Only Access

```java
@Service
public class StudentService {
    
    // View own profile — restricted to authenticated student's own ID
    @PreAuthorize("hasRole('STUDENT')")
    public StudentDTO getMyProfile(String authenticatedUserId) {
        return studentRepository.findByUserId(authenticatedUserId)
            .map(mapper::toStudentDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }
    
    // View campus data — read-only
    public List<LocationDTO> getAllLocations() { ... }  // delegates to LocationService
    public List<DepartmentDTO> getAllDepartments() { ... }
    public List<FacilityDTO> getAllFacilities() { ... }
    
    // View own timetable only
    @PreAuthorize("hasRole('STUDENT')")
    public List<TimetableDTO> getMyTimetable(String authenticatedStudentId) {
        Student student = studentRepository.findByUserId(authenticatedStudentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return timetableRepository.findByStudentId(student.getId())
            .stream().map(mapper::toTimetableDTO).collect(Collectors.toList());
    }
    
    // Route finding — delegates to RouteEngine
    public RouteFinderResponse findRoute(RouteFinderRequest req) {
        return routeEngine.findShortestPath(req.getSourceLocationId(), req.getDestinationLocationId());
    }
}
```

**Restrictions enforced at service level**:
- No create/update/delete methods exist in StudentService
- Timetable access validates that the requesting student ID matches the authenticated user
- No access to other students' data

---

## 9. Visitor Backend Implementation

### VisitorService

```java
@Service
public class VisitorService {
    
    // Visitor entry — no credentials
    public VisitorEntryResponse enter(String name) {
        Visitor visitor = new Visitor();
        visitor.setName(name);
        visitor.setEntryTime(LocalDateTime.now());
        Visitor saved = visitorRepository.save(visitor);
        
        // Generate limited-scope JWT for visitor
        String token = jwtTokenProvider.generateVisitorToken(saved.getId(), name);
        return new VisitorEntryResponse(token, saved.getId(), name, "VISITOR");
    }
    
    // Public campus data — no private info
    public List<LocationDTO> getPublicLocations() {
        return locationRepository.findByIsPublicTrue()
            .stream().map(mapper::toLocationDTO).collect(Collectors.toList());
    }
    
    public List<DepartmentDTO> getAllDepartments() { ... }   // Public info only
    public List<FacilityDTO> getAllFacilities() { ... }      // Public info only
    
    // Route finding — same as student (uses RouteEngine)
    public RouteFinderResponse findRoute(RouteFinderRequest req) {
        return routeEngine.findShortestPath(req.getSourceLocationId(), req.getDestinationLocationId());
    }
}
```

**Visitor Restrictions (enforced)**:
- Cannot access student timetables
- Cannot access private student data
- Cannot modify any data
- Cannot access admin-only endpoints
- Cannot create/manage accounts

---

## 10. DSA Implementation Details

### Graph Representation

```java
@Component
public class CampusGraph {
    // HashMap for O(1) vertex lookup — preserves original DSA requirement
    private final HashMap<String, List<GraphEdge>> adjacencyList = new HashMap<>();
    
    // HashSet for O(1) duplicate vertex detection
    private final HashSet<String> vertices = new HashSet<>();
    
    public void addVertex(String locationId) {
        if (!vertices.contains(locationId)) {
            vertices.add(locationId);
            adjacencyList.put(locationId, new ArrayList<>());
        }
    }
    
    public void addEdge(String source, String dest, double weight, boolean bidirectional) {
        adjacencyList.computeIfAbsent(source, k -> new ArrayList<>())
                     .add(new GraphEdge(dest, weight));
        if (bidirectional) {
            adjacencyList.computeIfAbsent(dest, k -> new ArrayList<>())
                         .add(new GraphEdge(source, weight));
        }
    }
}
```

**Complexity**: O(1) vertex lookup via HashMap; O(V+E) traversal.

---

### BFS Algorithm

**Class**: `BFSTraversal.java`  
**Purpose**: Connectivity check — verify whether two locations are reachable before running Dijkstra.

```java
public class BFSTraversal {

    // Uses Queue<String> — preserves original DSA requirement
    public boolean isReachable(CampusGraph graph, String sourceId, String destId) {
        if (!graph.hasVertex(sourceId) || !graph.hasVertex(destId)) return false;
        if (sourceId.equals(destId)) return true;
        
        Queue<String> queue = new LinkedList<>();     // Queue for BFS
        Set<String> visited = new HashSet<>();        // Visited set for O(1) lookup
        
        queue.add(sourceId);
        visited.add(sourceId);
        
        while (!queue.isEmpty()) {
            String current = queue.poll();
            for (GraphEdge edge : graph.getNeighbors(current)) {
                if (edge.getDestination().equals(destId)) return true;
                if (!visited.contains(edge.getDestination())) {
                    visited.add(edge.getDestination());
                    queue.add(edge.getDestination());
                }
            }
        }
        return false;
    }
    
    // Returns all reachable locations from a source (graph traversal)
    public List<String> getAllReachable(CampusGraph graph, String sourceId) {
        List<String> reachable = new ArrayList<>();
        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        queue.add(sourceId);
        visited.add(sourceId);
        while (!queue.isEmpty()) {
            String current = queue.poll();
            reachable.add(current);
            for (GraphEdge edge : graph.getNeighbors(current)) {
                if (!visited.contains(edge.getDestination())) {
                    visited.add(edge.getDestination());
                    queue.add(edge.getDestination());
                }
            }
        }
        return reachable;
    }
}
```

**Complexity**: O(V+E) — V vertices, E edges  
**Use in system**: Called before Dijkstra to quickly validate reachability; shown in route finder result.

---

### Dijkstra's Algorithm

**Class**: `DijkstraAlgorithm.java`  
**Purpose**: Find the shortest weighted path between two campus locations.

```java
public class DijkstraAlgorithm {

    // GraphNode implements Comparable for PriorityQueue ordering
    // Preserves PriorityQueue requirement from original system
    public RouteResult findShortestPath(CampusGraph graph, String sourceId, String destId) {
        HashMap<String, Double> distances = new HashMap<>();  // HashMap for O(1) distance lookup
        HashMap<String, String> predecessors = new HashMap<>(); // For path reconstruction
        
        // Initialize all distances to infinity
        for (String vertex : graph.getAllVertices()) {
            distances.put(vertex, Double.MAX_VALUE);
        }
        distances.put(sourceId, 0.0);
        
        // PriorityQueue<GraphNode> — min-heap ordered by distance
        // Preserves PriorityQueue requirement
        PriorityQueue<GraphNode> pq = new PriorityQueue<>(
            Comparator.comparingDouble(GraphNode::getDistance)
        );
        pq.add(new GraphNode(sourceId, 0.0));
        
        Set<String> settled = new HashSet<>();
        
        while (!pq.isEmpty()) {
            GraphNode current = pq.poll();
            String currentId = current.getLocationId();
            
            if (settled.contains(currentId)) continue;
            settled.add(currentId);
            
            if (currentId.equals(destId)) break; // Early termination
            
            for (GraphEdge edge : graph.getNeighbors(currentId)) {
                String neighbor = edge.getDestination();
                double newDist = distances.get(currentId) + edge.getWeight();
                
                if (newDist < distances.getOrDefault(neighbor, Double.MAX_VALUE)) {
                    distances.put(neighbor, newDist);
                    predecessors.put(neighbor, currentId);
                    pq.add(new GraphNode(neighbor, newDist));
                }
            }
        }
        
        // Reconstruct path using predecessors map
        if (distances.get(destId) == Double.MAX_VALUE) {
            return RouteResult.unreachable(); // No path found
        }
        
        List<String> path = reconstructPath(predecessors, sourceId, destId);
        return new RouteResult(path, distances.get(destId), true);
    }
    
    private List<String> reconstructPath(HashMap<String, String> predecessors, 
                                          String source, String dest) {
        List<String> path = new ArrayList<>();
        String current = dest;
        while (current != null) {
            path.add(0, current); // Prepend to get correct order
            current = predecessors.get(current);
        }
        return path;
    }
}
```

**GraphNode.java** — Implements Comparable for PriorityQueue:
```java
public class GraphNode implements Comparable<GraphNode> {
    private String locationId;
    private double distance;
    
    @Override
    public int compareTo(GraphNode other) {
        return Double.compare(this.distance, other.distance);
    }
}
```

**Complexity**: O((V+E) log V) — using PriorityQueue (min-heap)

---

### RouteEngine — Graph Initializer & Facade

```java
@Component
@Slf4j
public class RouteEngine {
    @Autowired private CampusGraph campusGraph;
    @Autowired private LocationRepository locationRepository;
    @Autowired private RouteRepository routeRepository;
    @Autowired private BFSTraversal bfsTraversal;
    @Autowired private DijkstraAlgorithm dijkstraAlgorithm;
    
    // Load all routes from DB into graph at application startup
    @PostConstruct
    public void initializeGraph() {
        locationRepository.findAll().forEach(loc ->
            campusGraph.addVertex(loc.getLocationId()));
        routeRepository.findAll().forEach(route ->
            campusGraph.addEdge(
                route.getSourceLocation().getLocationId(),
                route.getDestinationLocation().getLocationId(),
                route.getDistance(),
                route.isBidirectional()
            ));
        log.info("Campus graph initialized with {} vertices", 
            campusGraph.getVertexCount());
    }
    
    // Main entry point for route finding
    public RouteFinderResponse findShortestPath(String sourceId, String destId) {
        // Step 1: BFS connectivity check
        boolean reachable = bfsTraversal.isReachable(campusGraph, sourceId, destId);
        if (!reachable) {
            return RouteFinderResponse.noPath(sourceId, destId);
        }
        
        // Step 2: Dijkstra shortest path
        RouteResult result = dijkstraAlgorithm.findShortestPath(campusGraph, sourceId, destId);
        
        // Step 3: Enrich with location names
        List<String> pathNames = result.getPath().stream()
            .map(id -> locationRepository.findByLocationId(id)
                .map(Location::getName).orElse(id))
            .collect(Collectors.toList());
        
        return new RouteFinderResponse(result.getPath(), pathNames, 
            result.getTotalDistance(), true);
    }
}
```

### DSA Summary Table

| Data Structure | Implementation Class | Purpose | Complexity |
|---|---|---|---|
| **Graph (Adjacency List)** | `CampusGraph` | Campus map representation | O(1) vertex lookup |
| **HashMap** | `CampusGraph.adjacencyList` | Vertex → edges lookup | O(1) |
| **HashMap** | `DijkstraAlgorithm.distances` | Distance tracking | O(1) |
| **HashMap** | `DijkstraAlgorithm.predecessors` | Path reconstruction | O(1) |
| **ArrayList/List** | `CampusGraph` edge lists | Route storage per vertex | O(1) append |
| **ArrayList** | All services | Collections management | O(n) iterate |
| **PriorityQueue** | `DijkstraAlgorithm.pq` | Min-heap for Dijkstra | O(log n) push/pop |
| **Queue (LinkedList)** | `BFSTraversal.queue` | BFS traversal order | O(1) enqueue/dequeue |
| **HashSet** | `BFSTraversal.visited` | Visited node tracking | O(1) lookup |
| **HashMap (user cache)** | `AdminService` | Duplicate ID O(1) check | O(1) |

---

## 11. Search System Design

### Backend

```
GET /api/search?query=eng&type=location&page=0&size=20
```

**SearchService.java**:
```java
@Service
public class SearchService {
    public SearchResultDTO search(String query, String type, int page, int size) {
        String pattern = "%" + query.trim().toLowerCase() + "%";
        Pageable pageable = PageRequest.of(page, size);
        
        SearchResultDTO result = new SearchResultDTO();
        
        if (type == null || type.equals("location") || type.equals("all")) {
            result.setLocations(locationRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable));
        }
        if (type == null || type.equals("department") || type.equals("all")) {
            result.setDepartments(departmentRepository
                .findByNameContainingIgnoreCase(query, pageable));
        }
        if (type == null || type.equals("facility") || type.equals("all")) {
            result.setFacilities(facilityRepository
                .findByNameContainingIgnoreCase(query, pageable));
        }
        return result;
    }
}
```

**Repository Query**:
```java
@Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', :query, '%'))")
Page<Location> searchByNameOrDescription(@Param("query") String query, Pageable pageable);
```

**Database Strategy**: `LIKE` with `LOWER()` for case-insensitive search; B-tree indexes on `name` columns accelerate partial matches.

**Error Handling**:
- Empty query: Return 400 with message "Search query cannot be empty"
- No results: Return 200 with empty lists (not 404)
- Invalid type: Return 400 with valid type options

---

## 12. Route Finder Design

### Frontend Flow

```
1. User selects source location from dropdown (populated via GET /api/locations)
2. User selects destination location from dropdown
3. User clicks "Find Route" button
4. Frontend sends POST /api/routes/find { sourceLocationId, destinationLocationId }
5. Loading spinner shown during API call
6. Result displayed: ordered path list with total distance
7. BFS reachability status shown as badge
```

**RouteFinderPage.jsx Key Logic**:
```jsx
const handleFindRoute = async () => {
  if (!sourceId || !destId) {
    setError("Please select both source and destination");
    return;
  }
  if (sourceId === destId) {
    setError("Source and destination cannot be the same");
    return;
  }
  setLoading(true);
  try {
    const response = await routeService.findRoute({ 
      sourceLocationId: sourceId, 
      destinationLocationId: destId 
    });
    setRouteResult(response.data.data);
  } catch (err) {
    setError(err.response?.data?.error?.message || "Failed to find route");
  } finally {
    setLoading(false);
  }
};
```

### Example Route Result Display

```
📍 Shortest Path Found

Engineering Block A → Central Hub → Library

Total Distance: 450.5 meters
Stops: 3 locations
Connectivity: ✅ Reachable (BFS verified)
Algorithm: Dijkstra's Shortest Path
```

**Error Cases**:
- No path: "No route exists between these locations" (with suggestion to check routes)
- Invalid location: 404 response handled gracefully
- Same source/dest: Frontend validation prevents API call

---

## 13. React Frontend Architecture

### Project Structure

```
smart-campus-frontend/src/
├── pages/
│   ├── public/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── VisitorEntryPage.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageLocations.jsx
│   │   ├── ManageDepartments.jsx
│   │   ├── ManageFacilities.jsx
│   │   ├── ManageRoutes.jsx
│   │   ├── ManageOperations.jsx
│   │   ├── ManageStudents.jsx
│   │   ├── ManageAdmins.jsx
│   │   └── ManageTimetable.jsx
│   ├── student/
│   │   ├── StudentDashboard.jsx
│   │   ├── CampusInfoPage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── RouteFinderPage.jsx
│   │   ├── TimetablePage.jsx
│   │   └── ProfilePage.jsx
│   └── visitor/
│       ├── VisitorDashboard.jsx
│       ├── SearchPage.jsx
│       └── RouteFinderPage.jsx
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── StudentSidebar.jsx
│   │   ├── VisitorSidebar.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   ├── SearchBar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── EmptyState.jsx
│   │   ├── SuccessToast.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── StatusBadge.jsx
│   │   └── DashboardCard.jsx
│   ├── campus/
│   │   ├── LocationCard.jsx
│   │   ├── DepartmentCard.jsx
│   │   └── FacilityCard.jsx
│   ├── route/
│   │   └── RouteFinder.jsx
│   └── timetable/
│       └── TimetableGrid.jsx
├── services/
│   ├── apiClient.js          (Axios instance with interceptors)
│   ├── authService.js
│   ├── locationService.js
│   ├── departmentService.js
│   ├── facilityService.js
│   ├── routeService.js
│   ├── operationsService.js
│   ├── timetableService.js
│   ├── studentService.js
│   ├── adminService.js
│   └── searchService.js
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   ├── useForm.js
│   └── useToast.js
├── context/
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
├── routes/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── utils/
│   ├── tokenUtils.js
│   ├── dateUtils.js
│   ├── validationUtils.js
│   └── constants.js
└── assets/
    ├── styles/
    │   ├── index.css
    │   └── variables.css
    └── images/
```

### URL Hierarchy

| URL | Page | Role |
|---|---|---|
| `/` | LandingPage | Public |
| `/login` | LoginPage | Public |
| `/visitor` | VisitorEntryPage | Public |
| `/admin/dashboard` | AdminDashboard | ADMIN |
| `/admin/locations` | ManageLocations | ADMIN |
| `/admin/departments` | ManageDepartments | ADMIN |
| `/admin/facilities` | ManageFacilities | ADMIN |
| `/admin/routes` | ManageRoutes | ADMIN |
| `/admin/operations` | ManageOperations | ADMIN |
| `/admin/students` | ManageStudents | ADMIN |
| `/admin/admins` | ManageAdmins | ADMIN |
| `/admin/timetable` | ManageTimetable | ADMIN |
| `/student/dashboard` | StudentDashboard | STUDENT |
| `/student/campus` | CampusInfoPage | STUDENT |
| `/student/search` | SearchPage | STUDENT |
| `/student/route-finder` | RouteFinderPage | STUDENT |
| `/student/timetable` | TimetablePage | STUDENT |
| `/student/profile` | ProfilePage | STUDENT |
| `/visitor/dashboard` | VisitorDashboard | VISITOR |
| `/visitor/search` | SearchPage | VISITOR |
| `/visitor/route-finder` | RouteFinderPage | VISITOR |

---

## 14. Reusable Frontend Components

### `DataTable.jsx`
- **Props**: `columns` (array), `data` (array), `loading`, `onEdit`, `onDelete`, `searchable`, `paginated`
- **State**: `currentPage`, `sortColumn`, `sortDirection`, `filterQuery`
- **Features**: Client-side sort, pagination, row actions (edit/delete buttons)

### `Modal.jsx`
- **Props**: `isOpen`, `onClose`, `title`, `children`, `footer`
- **State**: Controlled by parent (isOpen prop)
- **Behavior**: Closes on backdrop click and Escape key

### `SearchBar.jsx`
- **Props**: `onSearch`, `placeholder`, `debounceMs` (default 300), `entityType`
- **State**: `inputValue`
- **Behavior**: Debounced search; calls `onSearch` with trimmed query

### `ProtectedRoute.jsx`
```jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
```

### `RouteFinder.jsx`
- **Props**: `locations` (array), `onFind`, `result`, `loading`
- **State**: `sourceId`, `destId`
- **API**: Calls `routeService.findRoute()` on form submit
- **Display**: Path as numbered list, total distance badge, BFS status badge

### `TimetableGrid.jsx`
- **Props**: `entries` (array of timetable objects)
- **Display**: Grid by day of week × time slot; color-coded subjects

### `DashboardCard.jsx`
- **Props**: `title`, `value`, `icon`, `color`, `onClick`
- **Purpose**: Stat summary card on dashboards (e.g., "Total Locations: 12")

---

## 15. Frontend Routing & Role-Based Authorization

### AppRouter.jsx

```jsx
const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/visitor" element={<VisitorEntryPage />} />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="locations" element={<ManageLocations />} />
        {/* ... all admin routes ... */}
      </Route>
      
      {/* Student routes */}
      <Route path="/student/*" element={
        <ProtectedRoute requiredRole="STUDENT">
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        {/* ... all student routes ... */}
      </Route>
      
      {/* Visitor routes */}
      <Route path="/visitor/*" element={
        <ProtectedRoute requiredRole="VISITOR">
          <VisitorLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<VisitorDashboard />} />
        {/* ... all visitor routes ... */}
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
```

### Token Storage **[RECOMMENDED]**: `localStorage`
- Access token stored in `localStorage.getItem('accessToken')`
- Refresh token stored in `localStorage.getItem('refreshToken')`
- User data stored in `AuthContext` state (not localStorage for security)
- On page reload: read token from localStorage, validate, restore context

### Logout Flow
```jsx
const logout = () => {
  authService.logout(refreshToken);    // Invalidate server-side
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setUser(null);
  setIsAuthenticated(false);
  navigate('/login');
};
```

---

## 16. State Management Strategy

**Choice: Context API + useReducer** **[RECOMMENDED]**

**Justification**: For an academic project with moderate state complexity (auth, user data, toast notifications), Context API + useReducer provides:
- No additional dependencies (built into React)
- Clear action-based state transitions
- Sufficient for expected scale (no complex cross-component state sharing)
- Easier to understand and debug for student developers

**Redux Toolkit** would be appropriate only if the project expands significantly post-submission.

### Contexts Defined

#### `AuthContext`
```jsx
const AuthContext = createContext();
const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':  return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT': return { user: null, isAuthenticated: false, role: null };
    default: return state;
  }
};
```

**Manages**: `user` object, `isAuthenticated`, `role`, `accessToken`, `logout()`

#### `ToastContext`
**Manages**: Toast notification queue, `showSuccess()`, `showError()`, `showInfo()`

### What is NOT in Context (uses local state):
- Form input values (local to form components)
- Table pagination state (local to DataTable)
- Modal open/close state (local to parent)
- Search query (local to SearchBar)

---

## 17. UI/UX Requirements

### Layout Structure
```
┌─────────────────────────────────────────┐
│              Navbar (top)               │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │      Main Content Area       │
│ (left)   │                              │
│          │                              │
├──────────┴──────────────────────────────┤
│              Footer (bottom)            │
└─────────────────────────────────────────┘
```

### Role-Specific Sidebars

**Admin Sidebar Items**: Dashboard, Locations, Departments, Facilities, Routes, Operations, Students, Admins, Timetable

**Student Sidebar Items**: Dashboard, Campus Info, Search, Route Finder, My Timetable, Profile

**Visitor Sidebar Items**: Dashboard, Campus Info, Search, Route Finder

### Dashboard Cards (Admin)
- Total Locations (count)
- Total Students (count)
- Total Routes (count)
- Total Facilities (count)
- Quick action buttons per card

### Form Design
- Inline validation with error messages below fields
- Submit button disabled during loading
- Required fields marked with asterisk (*)
- Form resets after successful submission
- Confirmation step before destructive actions (delete)

### Table Design
- Columns: sortable by click on header
- Pagination: 10 items per page default
- Search/filter row above table
- Actions column: Edit (pencil icon), Delete (trash icon)
- Row hover highlight

### Search Interface
- Search bar prominent at top of page
- Debounced: fires 300ms after user stops typing
- Results appear in cards below search bar
- Entity type filter tabs (All / Locations / Departments / Facilities)
- No results state with helpful message

### Route Finder Interface
- Two dropdowns: Source Location, Destination Location
- "Find Route" button (disabled if either dropdown empty)
- Result card shows: numbered path, total distance, algorithm used
- BFS connectivity status shown as colored badge (Reachable / Not Reachable)

### Timetable Display
- Grid: Rows = time slots (8:00–18:00 in 1h slots), Columns = days (Mon–Sat)
- Color-coded by subject
- Empty slot shows "–"

### Responsive Breakpoints
- Mobile: < 768px — sidebar collapses to hamburger menu
- Tablet: 768px–1024px — sidebar icon-only mode
- Desktop: > 1024px — full sidebar with labels

### States
- **Loading**: Spinner centered in content area
- **Empty**: Illustration + "No [items] found" + action button if admin
- **Error**: Red banner with error message + "Retry" button
- **Success**: Green toast notification (auto-dismiss 3s)
- **Confirmation Dialog**: Modal with "Are you sure?" + Cancel + Confirm (red) buttons

---

## 18. Validation & Error Handling

### Backend Validation Rules

| Field | Rule | Error Code | HTTP Status |
|---|---|---|---|
| Admin/Student ID | Required, 1–50 chars, must be unique | `DUPLICATE_ID` | 409 |
| Username | Required, 3–50 chars, alphanumeric+underscore, unique | `DUPLICATE_USERNAME` | 409 |
| Password | Required, min 6 chars | `INVALID_PASSWORD` | 400 |
| Full Name | Required, 1–100 chars, letters+spaces | `INVALID_NAME` | 400 |
| Location ID | Required, unique | `DUPLICATE_ID` | 409 |
| Location Name | Required, 1–100 chars | `MISSING_REQUIRED_FIELD` | 400 |
| Route Distance | Required, > 0, numeric | `INVALID_DISTANCE` | 400 |
| Route source ≠ dest | Must not be equal | `INVALID_ROUTE_SELF_LOOP` | 400 |
| Route locations | Must exist in DB | `RESOURCE_NOT_FOUND` | 404 |
| Timetable day | Must be valid day enum | `INVALID_DAY` | 400 |
| Timetable time | end_time > start_time | `INVALID_TIME_RANGE` | 400 |
| JWT token | Valid, not expired | `TOKEN_EXPIRED` / `INVALID_TOKEN` | 401 |
| Role authorization | Token role matches endpoint | `INSUFFICIENT_ROLE` | 403 |
| Any resource lookup | Resource must exist | `RESOURCE_NOT_FOUND` | 404 |

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ID",
    "message": "Student with ID S001 already exists",
    "field": "studentId",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### GlobalExceptionHandler — Status Code Mapping

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DuplicateIdException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateId(DuplicateIdException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(ex.getCode(), ex.getMessage(), ex.getField()));
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("RESOURCE_NOT_FOUND", ex.getMessage(), null));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String field = ex.getBindingResult().getFieldError().getField();
        String message = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("VALIDATION_ERROR", message, field));
    }
    // ... other handlers
}
```

### Frontend Validation

```js
// validationUtils.js
export const validateStudentId = (id) => {
  if (!id || id.trim() === '') return 'Student ID is required';
  if (id.length > 50) return 'Student ID cannot exceed 50 characters';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateDistance = (distance) => {
  if (!distance) return 'Distance is required';
  if (isNaN(distance) || parseFloat(distance) <= 0) return 'Distance must be a positive number';
  return null;
};
```

---

## 19. Testing Strategy

### Backend Unit Tests (JUnit 5 + Mockito)

**Test Classes**:
```
src/test/java/com/smartcampus/
├── service/
│   ├── AuthServiceTest.java
│   ├── LocationServiceTest.java
│   ├── StudentManagementServiceTest.java
│   ├── SearchServiceTest.java
│   └── TimetableServiceTest.java
├── dsa/
│   ├── CampusGraphTest.java
│   ├── BFSTraversalTest.java
│   └── DijkstraAlgorithmTest.java
├── controller/
│   ├── AuthControllerTest.java
│   ├── AdminControllerTest.java
│   ├── StudentControllerTest.java
│   └── RouteControllerTest.java
└── security/
    ├── JwtTokenProviderTest.java
    └── RBACTest.java
```

### Specific Test Cases

#### Admin Login
```java
@Test void adminLogin_validCredentials_returnsJwt() { ... }
@Test void adminLogin_invalidPassword_returns401() { ... }
@Test void adminLogin_nonExistentUser_returns401() { ... }
```

#### Duplicate ID Rejection
```java
@Test void createStudent_duplicateId_returns409() {
    when(studentRepository.existsByStudentId("S001")).thenReturn(true);
    assertThrows(DuplicateIdException.class, () -> service.createStudent(request));
}
```

#### RBAC Tests
```java
@Test void studentCannotCreateLocation_returns403() { ... }
@Test void visitorCannotAccessTimetable_returns403() { ... }
@Test void studentCanOnlyViewOwnTimetable() { ... }
@Test void adminCanAccessAllEndpoints() { ... }
```

#### BFS Tests
```java
@Test void bfs_reachableNodes_returnsTrue() { ... }
@Test void bfs_disconnectedGraph_returnsFalse() { ... }
@Test void bfs_sameSourceDest_returnsTrue() { ... }
@Test void bfs_emptyGraph_returnsFalse() { ... }
```

#### Dijkstra Tests
```java
@Test void dijkstra_simpleGraph_returnsShortestPath() {
    // Known graph: A--5--B--3--C, A--10--C
    // Expected: A→B→C = 8, not A→C = 10
}
@Test void dijkstra_noPath_returnsUnreachable() { ... }
@Test void dijkstra_singleNode_returnsZeroDistance() { ... }
@Test void dijkstra_negativeCycle_notApplicable() { // Distances always positive }
```

#### CRUD Tests
```java
@Test void createLocation_valid_returns201() { ... }
@Test void createLocation_duplicateId_returns409() { ... }
@Test void deleteLocation_notFound_returns404() { ... }
@Test void updateLocation_valid_returns200() { ... }
```

#### Database Persistence Tests (@DataJpaTest)
```java
@Test void saveStudent_persistsToDatabase() { ... }
@Test void deleteStudent_cascadesTimetable() { ... }
@Test void routeConstraint_selfLoop_throwsException() { ... }
```

### Frontend Tests (React Testing Library + Jest)

```javascript
// LoginPage.test.jsx
test('renders login form with all fields', () => { ... });
test('shows error on invalid credentials', async () => { ... });
test('navigates to admin dashboard on successful admin login', async () => { ... });

// RouteFinder.test.jsx  
test('disables Find Route button when no selection made', () => { ... });
test('displays route result on successful API call', async () => { ... });
test('shows error when source equals destination', () => { ... });

// DataTable.test.jsx
test('renders table with correct columns', () => { ... });
test('calls onDelete when delete button clicked', () => { ... });
test('filters rows on search input', () => { ... });
```

### End-to-End Tests (Cypress **[RECOMMENDED]**)

```javascript
// admin-workflow.cy.js
it('Admin can login, add location, and verify it appears in list', () => {
  cy.visit('/login');
  cy.get('#username').type('admin');
  cy.get('#password').type('password');
  cy.get('#login-btn').click();
  cy.url().should('include', '/admin/dashboard');
  cy.get('#nav-locations').click();
  cy.get('#add-location-btn').click();
  cy.get('#location-id').type('LOC999');
  cy.get('#location-name').type('Test Building');
  cy.get('#submit-btn').click();
  cy.contains('Test Building').should('be.visible');
});
```

---

## 20. Deployment Strategy

### Docker Configuration

#### Backend Dockerfile
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### nginx.conf
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./smart-campus-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      SERVER_PORT: 8080
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build: ./smart-campus-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### .env.example
```
POSTGRES_DB=smartcampus
POSTGRES_USER=campus_user
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_256_bit_jwt_secret_here
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### CI/CD — GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn test
        working-directory: smart-campus-backend

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: npm ci && npm test -- --watchAll=false
        working-directory: smart-campus-frontend
```

### Deployment Options (Student Project)

| Platform | Cost | Complexity | Recommended For |
|---|---|---|---|
| **Local Docker** | Free | Low | Development & demo |
| **Railway.app** | Free tier available | Low | Quick cloud deploy |
| **Render.com** | Free tier available | Low | Public demo |
| **Heroku** | Student credits | Medium | Academic hosting |
| **University Server** | Free | Medium | Course submission |

### Logging Strategy
- Backend: SLF4J + Logback (default Spring Boot), log level INFO in prod
- Log request/response via `@Slf4j` in controllers
- Frontend: `console.error()` for errors, remove debug logs before submission

---

## 21. Non-Functional Requirements

| Category | Target | Notes |
|---|---|---|
| API Response Time | < 500ms per endpoint | Acceptable for academic project |
| Dijkstra Execution | < 50ms for campus-scale graph | < 100 nodes typical |
| BFS Execution | < 20ms | O(V+E) |
| Concurrent Users | 10–50 simultaneous | Single-instance deployment |
| Database Queries | < 100ms | With indexes on search fields |
| Uptime | 95%+ in dev environment | Not production SLA |
| JWT Expiry | Access: 24h, Refresh: 7d | **[RECOMMENDED]** |
| Password Hashing | BCrypt strength 12 | **[RECOMMENDED]** |
| Session Management | Stateless JWT | No server-side sessions |
| Input Validation | All fields validated | Both frontend and backend |
| SQL Injection | Prevented via JPA/JPQL | No raw string queries |
| XSS Prevention | React handles by default | No dangerouslySetInnerHTML |
| CORS | Configured for React origin only | `CorsConfig.java` |
| Logging | SLF4J, INFO level in prod | Error tracking |
| Health Check | `GET /actuator/health` | Spring Actuator |

---

## 22. Development Commands Reference

### Backend Commands

```powershell
# Generate Spring Boot project (run in project root)
# Option 1: Via start.spring.io web UI, download ZIP, extract
# Option 2: Spring Boot CLI
spring init --dependencies=web,data-jpa,security,postgresql,flyway,lombok,validation \
  --build=maven --java-version=17 --name=smart-campus-backend smart-campus-backend

# Install backend dependencies
cd smart-campus-backend
mvn dependency:resolve

# Run backend (development)
mvn spring-boot:run

# Run backend with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Build production JAR
mvn clean package -DskipTests

# Run tests
mvn test

# Run specific test class
mvn test -Dtest=DijkstraAlgorithmTest

# Run Flyway migrations manually
mvn flyway:migrate

# Check migration status
mvn flyway:info
```

### Frontend Commands

```powershell
# Create React application
npx create-react-app smart-campus-frontend
cd smart-campus-frontend

# Install required dependencies
npm install react-router-dom axios react-hook-form

# Optional but recommended
npm install react-toastify  # Toast notifications

# Run frontend (development)
npm start

# Build production bundle
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

### Database Commands

```powershell
# Run PostgreSQL via Docker
docker run --name campus-postgres -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smartcampus -p 5432:5432 -d postgres:15-alpine

# Connect to PostgreSQL
docker exec -it campus-postgres psql -U postgres -d smartcampus

# Full stack with docker-compose
docker-compose up --build        # Build and start all services
docker-compose up -d             # Start in background
docker-compose down              # Stop all services
docker-compose down -v           # Stop and remove volumes (CAUTION: deletes data)
docker-compose logs backend      # View backend logs
docker-compose logs -f           # Follow all logs
```

---

## 23. Implementation Checklist

### Phase 1–3: Foundation
- [ ] Spring Boot project scaffold created (Maven, Java 17)
- [ ] `pom.xml` with all required dependencies
- [ ] `application.yml` configured (DB, JWT, server port)
- [ ] React application created with required packages
- [ ] Docker and docker-compose files created
- [ ] PostgreSQL schema created via Flyway migrations (V1–V5)
- [ ] All tables with constraints, indexes, and FK rules verified
- [ ] Seed admin account created in V5 migration

### Phase 4–6: Domain & Security
- [ ] Abstract `User` entity with JPA inheritance
- [ ] `Admin`, `Student`, `Visitor` entities extending User
- [ ] `Location`, `Department`, `Facility`, `Route`, `Operations`, `Timetable` entities
- [ ] All repositories with custom query methods
- [ ] All DTOs with Bean Validation annotations
- [ ] JWT token provider (generate, validate, extract claims)
- [ ] JWT authentication filter
- [ ] Spring Security config (public vs protected routes)
- [ ] CORS configured for React frontend
- [ ] BCrypt password encoder bean

### Phase 7–8: Auth & DSA
- [ ] `AuthService` login/logout/refresh
- [ ] Visitor entry endpoint
- [ ] Refresh token service with DB storage
- [ ] `CampusGraph` with HashMap adjacency list
- [ ] `GraphNode` (Comparable for PriorityQueue)
- [ ] `GraphEdge` (destination + weight)
- [ ] `BFSTraversal` using Queue<String>
- [ ] `DijkstraAlgorithm` using PriorityQueue<GraphNode>
- [ ] `RouteEngine` with @PostConstruct graph initialization
- [ ] DSA unit tests (BFS, Dijkstra, edge cases)

### Phase 9–13: Backend Services & Controllers
- [ ] `LocationService` — full CRUD with graph sync
- [ ] `DepartmentService` — full CRUD
- [ ] `FacilityService` — full CRUD
- [ ] `RouteService` — full CRUD with graph edge management
- [ ] `OperationsService` — full CRUD
- [ ] `TimetableService` — admin management + student view
- [ ] `AdminService` — admin account CRUD
- [ ] `StudentManagementService` — student account CRUD
- [ ] `StudentService` — read-only campus data access
- [ ] `VisitorService` — public data access
- [ ] `SearchService` — case-insensitive partial search
- [ ] All REST controllers with @PreAuthorize annotations
- [ ] @Valid on all request bodies
- [ ] GlobalExceptionHandler with all exception types
- [ ] All custom exception classes
- [ ] Duplicate ID detection (HashMap + DB constraint)

### Phase 14–18: Frontend
- [ ] `AuthContext` with useReducer
- [ ] `useAuth` custom hook
- [ ] Axios API client with JWT interceptor
- [ ] `authService.js` login/logout/refresh/visitor
- [ ] `ProtectedRoute` with role validation
- [ ] `AppRouter` with all routes defined
- [ ] `LoginPage` (Admin/Student login + Visitor entry)
- [ ] Admin dashboard with stat cards
- [ ] All 9 Admin management pages with CRUD tables + modals
- [ ] Student dashboard with quick links
- [ ] Student campus info, search, route finder, timetable pages
- [ ] Visitor dashboard, search, route finder pages
- [ ] `DataTable` reusable component
- [ ] `Modal` reusable component
- [ ] `SearchBar` with debounce
- [ ] `RouteFinder` component (dropdowns + result display)
- [ ] `TimetableGrid` component
- [ ] Toast notification system
- [ ] Confirmation dialog component
- [ ] Loading/Error/Empty states implemented throughout
- [ ] Responsive sidebar (mobile hamburger)

### Phase 19–20: Testing & Deployment
- [ ] Service unit tests (>80% coverage on critical paths)
- [ ] DSA unit tests (BFS, Dijkstra — all edge cases)
- [ ] Controller REST API tests (MockMvc)
- [ ] RBAC enforcement tests (all role-endpoint combinations)
- [ ] Database constraint tests
- [ ] Frontend component tests (React Testing Library)
- [ ] Backend Dockerfile (multi-stage build)
- [ ] Frontend Dockerfile (Node build + Nginx)
- [ ] docker-compose.yml (postgres + backend + frontend)
- [ ] .env.example documented
- [ ] GitHub Actions CI pipeline
- [ ] README with setup and run instructions

---

## 24. Recommended Implementation Order

### MVP — Weeks 1–3: Core Functionality

**Week 1: Backend Foundation**
1. Spring Boot project + dependencies
2. Flyway migrations (all tables)
3. Entity classes + repositories
4. JWT security infrastructure
5. Auth endpoints (login, logout, refresh)
6. Seed data (admin account)

**Week 2: Admin Backend**
1. DTOs and mappers
2. LocationService + LocationController (full CRUD)
3. DepartmentService + Controller
4. FacilityService + Controller
5. AdminService (account management)
6. GlobalExceptionHandler
7. Duplicate ID validation

**Week 3: React Foundation**
1. React project + dependencies
2. AuthContext + useAuth hook
3. Axios client + auth service
4. LoginPage (admin login)
5. ProtectedRoute
6. Admin dashboard page (static)
7. ManageLocations page (API connected)
8. DataTable + Modal components

**Milestone**: Admin can log in, add/edit/delete locations, departments, facilities.

---

### Version 1 — Weeks 4–8: Complete System

**Week 4: Remaining Admin Backend**
1. RouteService + Controller
2. OperationsService + Controller
3. StudentManagementService + Controller
4. TimetableService + Controller
5. Visitor entry endpoint

**Week 5: DSA Implementation**
1. CampusGraph (HashMap adjacency list)
2. BFSTraversal (Queue-based)
3. DijkstraAlgorithm (PriorityQueue-based)
4. RouteEngine (DB → graph init)
5. Route finder endpoint
6. DSA unit tests

**Week 6: Student & Visitor Backend**
1. StudentService (read-only)
2. StudentController
3. VisitorService (public access)
4. VisitorController
5. SearchService + Controller
6. RBAC enforcement testing

**Week 7: Frontend Completion**
1. All Admin management pages
2. ManageRoutes page
3. ManageStudents, ManageAdmins, ManageTimetable
4. Student pages (dashboard, campus info, search)
5. RouteFinderPage (student + visitor)
6. TimetablePage (student)
7. Visitor pages

**Week 8: Testing & Deployment**
1. Service unit tests
2. DSA tests
3. Controller integration tests
4. RBAC tests
5. Frontend component tests
6. Docker configuration
7. Full system test
8. README documentation

---

### Version 2 — Optional Post-Submission Enhancements

- Advanced analytics dashboard (usage statistics, most-used routes)
- Campus map visualization (SVG-based or canvas route display)
- Admin audit logs (track who created/deleted what)
- Advanced search filters (by building, floor, facility type)
- Export campus data (CSV download)
- Student profile editing (limited fields)
- Real-time status badges for operations (polling-based)

---

### What NOT to Build (Explicitly Out of Scope)

- ❌ Microservices architecture
- ❌ WebSocket/real-time communication
- ❌ Third-party mapping APIs (Google Maps, OpenStreetMap)
- ❌ Machine learning recommendations
- ❌ Multi-language (i18n) support
- ❌ Distributed caching (Redis)
- ❌ Message queues (Kafka, RabbitMQ)
- ❌ Kubernetes deployment
- ❌ Multi-tenant architecture
- ❌ OAuth2/SSO integration

---

*End of Implementation Plan — Smart Campus Management & Route Optimization System*

*All features from `Smart_Campus_Management_Report.pdf` are preserved. Additions are labeled **[RECOMMENDED]**.*
