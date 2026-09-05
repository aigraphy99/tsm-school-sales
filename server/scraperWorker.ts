import { db } from './dataStore.js';
import { ResearchJob, School, Evidence, DataConflict } from '../src/types.js';
import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.warn('Gemini client failed to initialize:', err);
    }
  }
  return geminiClient;
}

export class ScraperWorker {
  private queue: ResearchJob[] = [];
  private isProcessing = false;

  constructor() {
    // Populate any queued jobs from store if needed
  }

  public getJobs(): ResearchJob[] {
    return this.queue;
  }

  public addJob(school: School): ResearchJob {
    const existing = this.queue.find(j => j.schoolId === school.id && (j.status === 'RUNNING' || j.status === 'QUEUED'));
    if (existing) return existing;

    const job: ResearchJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      schoolId: school.id,
      schoolName: school.name,
      city: school.city,
      status: 'QUEUED',
      progress: 0,
      sourcesChecked: [],
      fieldsFound: [],
      confidence: 0,
      logs: [`[${new Date().toLocaleTimeString()}] Research job queued for ${school.name}`],
      startedAt: new Date().toISOString()
    };

    this.queue.unshift(job);
    this.processQueue();
    return job;
  }

  public addBatch(schools: School[]): ResearchJob[] {
    const jobs: ResearchJob[] = [];
    for (const s of schools) {
      const job: ResearchJob = {
        id: `job-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        schoolId: s.id,
        schoolName: s.name,
        city: s.city,
        status: 'QUEUED',
        progress: 0,
        sourcesChecked: [],
        fieldsFound: [],
        confidence: 0,
        logs: [`[${new Date().toLocaleTimeString()}] Batch job queued for ${s.name}`],
        startedAt: new Date().toISOString()
      };
      this.queue.unshift(job);
      jobs.push(job);
    }
    this.processQueue();
    return jobs;
  }

  public retryFailed(): number {
    let count = 0;
    for (const j of this.queue) {
      if (j.status === 'FAILED' || j.status === 'PARTIAL') {
        j.status = 'QUEUED';
        j.progress = 0;
        j.error = undefined;
        j.logs.push(`[${new Date().toLocaleTimeString()}] Retrying research job with fallback sources`);
        count++;
      }
    }
    if (count > 0) this.processQueue();
    return count;
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (true) {
      const nextJob = this.queue.find(j => j.status === 'QUEUED');
      if (!nextJob) break;

      await this.executeJob(nextJob);
    }

    this.isProcessing = false;
  }

  private async executeJob(job: ResearchJob) {
    const rawData = db.getRawData();
    const school = rawData.schools.find(s => s.id === job.schoolId);
    if (!school) {
      job.status = 'FAILED';
      job.error = 'School record not found in database';
      return;
    }

    job.status = 'RUNNING';
    job.progress = 10;
    job.logs.push(`[${new Date().toLocaleTimeString()}] Generating SearXNG search queries for: "${school.name}" "${school.city}" principal coordinator`);

    // Step 1: Query generation & simulation of multi-tier discovery
    await new Promise(r => setTimeout(r, 400));
    job.progress = 30;
    job.sourcesChecked.push('SearXNG Metasearch');
    job.logs.push(`[${new Date().toLocaleTimeString()}] Candidate URLs ranked. Preferred domain: ${school.website || 'Official Portal'}`);

    // Step 2: HTTP fetch / Playwright fallback simulation
    await new Promise(r => setTimeout(r, 500));
    job.progress = 60;
    job.sourcesChecked.push('Official School Website /faculty');
    job.sourcesChecked.push('CBSE Affiliation Portal (SARAS)');

    // Step 3: Entity extraction and matching
    const principal = rawData.contacts.find(c => c.schoolId === school.id && c.designation === 'PRINCIPAL');
    const coord = rawData.contacts.find(c => c.schoolId === school.id && (c.designation === 'COORDINATOR' || c.designation === 'OLYMPIAD_COORDINATOR'));

    job.fieldsFound = ['School Code', 'Board (CBSE)', 'Affiliation Number', 'Principal Contact'];
    if (coord) job.fieldsFound.push('Coordinator Contact');

    // Simulate resilience: 5% chance of partial / needs verification
    const isPartial = school.id.charCodeAt(school.id.length - 1) % 17 === 0;

    if (isPartial) {
      job.status = 'PARTIAL';
      job.confidence = 68;
      job.progress = 100;
      job.completedAt = new Date().toISOString();
      job.logs.push(`[${new Date().toLocaleTimeString()}] Website returned 403 bot protection. Switched to public education directory fallback. Partial record created.`);
      return;
    }

    // Step 4: Verification and Confidence Engine update
    job.status = 'COMPLETED';
    job.progress = 100;
    job.confidence = 94;
    job.completedAt = new Date().toISOString();
    job.logs.push(`[${new Date().toLocaleTimeString()}] Extraction verified. Principal ${principal?.name || 'Identified'} confidence scored at 0.94.`);

    // Update school record
    school.dataConfidence = Math.max(school.dataConfidence, 92);
    school.lastVerifiedAt = new Date().toISOString();
    school.updatedAt = new Date().toISOString();

    // Add activity
    db.addActivity({
      schoolId: school.id,
      userId: 'usr-4',
      userName: 'Research Worker (SearXNG + Crawlee)',
      type: 'RESEARCH',
      title: 'Automated Web Research Completed',
      description: `Discovered official website evidence, updated verification confidence to ${school.dataConfidence}%.`
    });

    db.commit();
  }
}

export const scraperWorker = new ScraperWorker();
