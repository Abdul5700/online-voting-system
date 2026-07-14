import bcrypt from 'bcryptjs'; import {pool} from '../config/db.js';
const hash=await bcrypt.hash('Admin@123',12);await pool.query("INSERT INTO users(full_name,usn,email,password,role) VALUES('System Administrator','ADMIN001','admin@vote.local',?,'admin') ON DUPLICATE KEY UPDATE password=VALUES(password)",[hash]);console.log('Admin seeded: admin@vote.local / Admin@123');await pool.end();
