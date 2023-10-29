import '../src/app/global.css';
import Navigation from '@/components/Navigation';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/TabStore';
import { organizationStore } from '@/stores/OrganizationStore';

interface AppProps {
  Component: React.ElementType;
  pageProps: any; // Adjust this type as needed
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {

  const { fetchAllPrompts, prompts } = promptStore();
  const { fetchAllModels } = modelStore();
  const { fetchOrganization, organization } = organizationStore();
  const { retrieveTabsFromLocalStorage, tabs, clearLocalTabs } = promptWorkspaceTabs();

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    Promise.all([fetchAllPrompts(), fetchAllModels(), fetchOrganization()]) // Wait for both API calls
    .then(() => {
      setLoading(false); // Set loading state to false when both API calls are complete
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error loading application...")
    });
  }, [fetchAllPrompts, fetchAllModels, retrieveTabsFromLocalStorage, fetchOrganization]); // The empty dependency array ensures this effect runs only once on component mount

  useEffect(() => {
    if (!organization || prompts == undefined || prompts.length < 1) return;
    retrieveTabsFromLocalStorage();
    clearLocalTabs();
  }, [organization, prompts])

  return (
    <div id="root">
      {loading ? ( // Render loading indicator if loading is true
        <div>Loading...</div>
      ) : (
        <div className="route-container">
          <div className="page-wrapper app-wrapper">
            <Navigation />
            <Component {...pageProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;