import { pool } from '../config/db.js';
export async function syncElectionStatuses(){
  await pool.query("UPDATE elections SET status='active' WHERE status='draft' AND start_date <= UTC_TIMESTAMP() AND end_date > UTC_TIMESTAMP()");
  await pool.query("UPDATE elections SET status='completed' WHERE status IN ('draft','active') AND end_date <= UTC_TIMESTAMP()");
}
const displayStatus = election => {
  const now = Date.now(), start = new Date(election.start_date).getTime(), end = new Date(election.end_date).getTime();
  if (end <= now) return 'completed';
  if (start > now) return 'scheduled';
  return election.status;
};
export async function list(req,res,next){try{await syncElectionStatuses();const [r]=await pool.query("SELECT e.*, COUNT(DISTINCT v.id) votes_cast, COUNT(DISTINCT c.id) candidate_count FROM elections e LEFT JOIN votes v ON v.election_id=e.id LEFT JOIN candidates c ON c.election_id=e.id GROUP BY e.id ORDER BY e.start_date DESC");res.json(r.map(e=>({...e,status:displayStatus(e)})))}catch(e){next(e)}}
export async function getOne(req,res,next){try{await syncElectionStatuses();const [e]=await pool.query('SELECT * FROM elections WHERE id=?',[req.params.id]);if(!e[0])return res.status(404).json({message:'Election not found'});const [c]=await pool.query('SELECT * FROM candidates WHERE election_id=? ORDER BY name',[req.params.id]);res.json({...e[0],status:displayStatus(e[0]),candidates:c})}catch(e){next(e)}}
export async function create(req,res,next){try{const {title,description,startDate,endDate,status='draft'}=req.body;const [r]=await pool.query('INSERT INTO elections(title,description,start_date,end_date,status) VALUES(?,?,?,?,?)',[title,description,startDate,endDate,status]);res.status(201).json({id:r.insertId,message:'Election created'})}catch(e){next(e)}}
export async function update(req,res,next){try{const {title,description,startDate,endDate,status}=req.body;await pool.query('UPDATE elections SET title=?,description=?,start_date=?,end_date=?,status=? WHERE id=?',[title,description,startDate,endDate,status,req.params.id]);res.json({message:'Election updated'})}catch(e){next(e)}}
export async function remove(req,res,next){try{await pool.query('DELETE FROM elections WHERE id=?',[req.params.id]);res.json({message:'Election deleted'})}catch(e){next(e)}}
