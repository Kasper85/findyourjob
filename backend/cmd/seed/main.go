package main

import (
	"database/sql"
	"fmt"
	"log"

	"find-your-job/backend/internal/config"
	"find-your-job/backend/internal/database"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("[SEED] Loading config...")

	cfg, err := config.Load(".env")
	if err != nil {
		log.Fatalf("[SEED] Config error: %v", err)
	}

	db, err := database.Connect(cfg.DB)
	if err != nil {
		log.Fatalf("[SEED] Database error: %v", err)
	}
	defer db.Close()

	log.Println("[SEED] Connected to PostgreSQL. Seeding...")

	// ── 1. Hash password ────────────────────────────
	hash, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("[SEED] bcrypt error: %v", err)
	}
	passwordHash := string(hash)

	// ── 2. Insert users (idempotent) ────────────────
	type seedUser struct {
		email string
		name  string
		role  string
	}

	users := []seedUser{
		{email: "admin@test.com", name: "Admin Seed", role: "admin"},
		{email: "candidate@test.com", name: "Candidate Seed", role: "candidate"},
		{email: "recruiter@test.com", name: "Recruiter Seed", role: "recruiter"},
	}

	for _, u := range users {
		_, err := db.Exec(
			`INSERT INTO users (email, password_hash, role, name, is_active)
			 VALUES ($1, $2, $3, $4, true)
			 ON CONFLICT (email) DO NOTHING`,
			u.email, passwordHash, u.role, u.name,
		)
		if err != nil {
			log.Fatalf("[SEED] User %s: %v", u.email, err)
		}
		log.Printf("[SEED] User ensured: %s (%s)", u.email, u.role)
	}

	// ── 3. Look up user IDs ─────────────────────────
	var candidateID, recruiterID string

	err = db.QueryRow(`SELECT id FROM users WHERE email = $1`, "candidate@test.com").Scan(&candidateID)
	if err != nil {
		log.Fatalf("[SEED] Find candidate: %v", err)
	}

	err = db.QueryRow(`SELECT id FROM users WHERE email = $1`, "recruiter@test.com").Scan(&recruiterID)
	if err != nil {
		log.Fatalf("[SEED] Find recruiter: %v", err)
	}

	// ── 4. Insert candidate profile (idempotent) ─────
	_, err = db.Exec(
		`INSERT INTO candidate_profiles (user_id, location, summary, experience_years, preferred_remote)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (user_id) DO NOTHING`,
		candidateID, "Buenos Aires, AR", "Full-stack developer with 5 years of experience in Go and React.", 5, true,
	)
	if err != nil {
		log.Fatalf("[SEED] Candidate profile: %v", err)
	}
	log.Println("[SEED] Candidate profile ensured")

	// ── 5. Insert company (check existence first) ────
	var companyID string
	err = db.QueryRow(`SELECT id FROM companies WHERE name = $1`, "Seed Company S.A.").Scan(&companyID)
	if err == sql.ErrNoRows {
		err = db.QueryRow(
			`INSERT INTO companies (name, description, website, location, size, industry)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING id`,
			"Seed Company S.A.",
			"Empresa de prueba generada por el seed de desarrollo.",
			"https://seedcompany.example.com",
			"Buenos Aires, AR",
			"medium",
			"technology",
		).Scan(&companyID)
		if err != nil {
			log.Fatalf("[SEED] Company: %v", err)
		}
		log.Println("[SEED] Company created")
	} else if err != nil {
		log.Fatalf("[SEED] Find company: %v", err)
	} else {
		log.Println("[SEED] Company already exists")
	}

	// ── 6. Insert recruiter (idempotent) ─────────────
	_, err = db.Exec(
		`INSERT INTO recruiters (user_id, company_id, position, phone)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (user_id) DO NOTHING`,
		recruiterID, companyID, "Tech Recruiter", "+541112345678",
	)
	if err != nil {
		log.Fatalf("[SEED] Recruiter: %v", err)
	}
	log.Println("[SEED] Recruiter ensured")

	// ── 7. Summary ──────────────────────────────────
	fmt.Println()
	log.Println("[SEED] ✅ Seed complete!")
	log.Println("[SEED] ")
	log.Println("[SEED] Users created (password: password123):")
	log.Println("[SEED]   admin@test.com      (admin)")
	log.Println("[SEED]   candidate@test.com  (candidate)")
	log.Println("[SEED]   recruiter@test.com  (recruiter)")
	log.Println("[SEED] ")
	log.Println("[SEED] Run: go run ./cmd/seed")
}
