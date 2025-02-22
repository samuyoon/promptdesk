import React, { useState } from "react";
import { shouldShowSaveModal } from "@/stores/GeneralStore";
import { promptWorkspaceTabs } from "@/stores/TabStore";
import { promptStore } from "@/stores/PromptStore";
import { useRouter } from 'next/router';

const Modal = () => {
  const { show_modal, toggle_modal } = shouldShowSaveModal();

  const { push } = useRouter();


  const {
    setPromptInformation,
    promptObject,
    createNewPrompt,
    updateExistingPrompt,
    duplicateExistingPrompt,
    deletePrompt,
    addToLocalPrompts
  } = promptStore();

  const {
    tabs,
    addTab,
    removeTabFromTabs,
    findBestNextTab,
    setActiveTab,
    isActiveTab,
    setActiveTabById
  } = promptWorkspaceTabs();

  const [ formValues, setFormValues ] = useState({
    name: promptObject.name,
    description: promptObject.description,
  });

  function changeName(name: string) {
    setFormValues({ ...formValues, name: name });
  }

  function changeDescription(description: string) {
    setFormValues({ ...formValues, description: description });
  }

  function setAllPromptInformation() {
    setPromptInformation("name", formValues.name);
    setPromptInformation("description", formValues.description);
  }

  const changeIdInUrl = (newId: string) => {
    const newUrl = `/workspace/${newId}`;
    push(newUrl);
  };

  const saveExistingButtonData = [
    { label: "Cancel", className: "btn-neutral", action: toggle_modal },
    { label: "Save as new", className: "btn-neutral", action: async () => {
        var newPrompt = await duplicateExistingPrompt(formValues.name, formValues.description);
        toggle_modal();
        if(newPrompt) {
          addToLocalPrompts(newPrompt);
          addTab(newPrompt.name, newPrompt.id, true);
          push("/workspace/" + newPrompt.id);
        }
      }
    },
    { label: "Update", className: "btn-primary", action: () => { setAllPromptInformation(); updateExistingPrompt(); toggle_modal(); } },
    { label: "Delete", className: "btn-negative", action: () => {
        var id = promptObject.id as string;
        
        deletePrompt();
        toggle_modal();

        //also found in the [id].tsx file
        if(isActiveTab(id) && tabs.length > 1) {
          const bestNextTab = findBestNextTab();
          bestNextTab?.prompt_id && changeIdInUrl(bestNextTab.prompt_id);
        }
    
        var x = removeTabFromTabs(id)?.length
        
        if (x === 0) {
          push("/prompts");
        }

      }
    },
  ];

  const saveNewButtonData = [
    { label: "Cancel", className: "btn-neutral", action: toggle_modal },
    { label: "Save", className: "btn-primary", action: async () => {
      setAllPromptInformation();
      var id = await createNewPrompt();
      if(id) {
        toggle_modal();
        push(`/workspace/${id}`);
      }
    } },
  ];

  const renderButtons = () => {
    if (!promptObject.new) {
      return (
        <>
          {saveExistingButtonData.map((button, index) => (
            <button
              key={index}
              tabIndex={0}
              className={`btn btn-sm btn-filled ${button.className} modal-button`}
              type="button"
              onClick={button.action}
            >
              <span className="btn-label-wrap">
                <span className="btn-label-inner">{button.label}</span>
              </span>
            </button>
          ))}
        </>
      );
    } else {
      return (
        <>
          {saveNewButtonData.map((button, index) => (
            <button
              key={index}
              tabIndex={0}
              className={`btn btn-sm btn-filled ${button.className} modal-button`}
              type="button"
              onClick={button.action}
            >
              <span className="btn-label-wrap">
                <span className="btn-label-inner">{button.label}</span>
              </span>
            </button>
          ))}
        </>
      );
    }
  };

  return (
    <div className="modal-root modal-is-open modal-closeable">
      <div className="modal-backdrop" />
      <div className="modal-dialog-container" tabIndex={0}>
        <div
          className="modal-dialog modal-size-medium"
        >
          <div>
            <div className="modal-header heading-medium">Save preset</div>
            <div className="modal-body body-small">
              <p>
                This will save the current Playground state as a preset which you
                can access later or share with others.
              </p>
              <br />
              <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-name">
                  <div className="bold mr-2">Name</div>
                </div>
                <input
                  className="text-input text-input-sm text-input-full"
                  type="text"
                  defaultValue={formValues.name}
                  onInput={(e) => changeName(e.currentTarget.value)}
                />
              </div>
              <br />
              <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-description">
                  <div className="bold mr-2">Description</div>
                  <div style={{ color: "var(--gray-600)" }}>Optional</div>
                </div>
                <input
                  className="text-input text-input-sm text-input-full"
                  type="text"
                  defaultValue={formValues.description}
                  onInput={(e) => changeDescription(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              {renderButtons()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;