import { Link } from 'react-router-dom';

export default function Home() {

 const userString = localStorage.getItem('genc_dossier_user');
  console.log('User string from localStorage:', userString)
// Initialize a default value
let isNewUser = true; 

if (userString) {
    // 2. Parse the string into an object
    const user = JSON.parse(userString);
    const userEmail = user.email; 

    // 3. Access the profile using the exact key format seen in your logs
    const profileDataRaw = localStorage.getItem(`genc_dossier_profile_${userEmail}`);
    
    if (profileDataRaw) {
        const fullData = JSON.parse(profileDataRaw);

        // 4. Check the cognizantId
        const cogId = fullData.profile?.cognizantId;

        // Logic: If ID exists and is NOT empty, isNewUser is false (they are an existing user)
        isNewUser = !(cogId && cogId.trim() !== "");
    }
}

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          GenC Dossier Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
          Build a professional dossier with your profile, skills, capstone project, achievements, and more.
          Choose a resume template, enable a web portfolio, and share one link.
        </p>
      </div>
      <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
        {isNewUser ? (
          /* --- CREATE CARD --- */
          <Link
            to="/build"
            className="block p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all text-left group"
          >
            <span className="text-3xl mb-3 block">📄</span>
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Create New Dossier
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Fill in your details, pick a resume and web template, then export LaTeX or share your portfolio link.
            </p>
          </Link>
        ) : (
          /* --- EDIT CARD --- */
          <Link
            to="/build"
            className="block p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all text-left group"
          >
            <span className="text-3xl mb-3 block">📝</span> {/* Changed emoji to differentiate */}
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Edit Existing Dossier
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Update your current information, change your templates, or re-export your documents.
            </p>
          </Link>
        )}
      </div>
      <div id="features" className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-700">
        <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white mb-6">What you get</h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">✓ LaTeX dossier (download .tex, compile to PDF)</li>
          <li className="flex items-center gap-2">✓ Multiple resume templates</li>
          <li className="flex items-center gap-2">✓ Multiple web portfolio layouts</li>
          <li className="flex items-center gap-2">✓ One shareable link for your portfolio</li>
        </ul>
      </div>


    </div>
  );
}
