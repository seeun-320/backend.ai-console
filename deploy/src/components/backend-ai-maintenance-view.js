define(["./backend-ai-console.js"],function(_backendAiConsole){"use strict";class BackendAiMaintenanceView extends _backendAiConsole.LitElement{static get is(){return"backend-ai-maintenance-view"}static get styles(){return[_backendAiConsole.BackendAiStyles,_backendAiConsole.IronFlex,_backendAiConsole.IronFlexAlignment,_backendAiConsole.IronFlexFactors,_backendAiConsole.IronPositioning,_backendAiConsole.css$1`
        div.indicator,
        span.indicator {
          font-size: 9px;
          margin-right: 5px;
        }

        div.description,
        span.description {
          font-size: 11px;
          margin-top: 5px;
          margin-right: 5px;
        }

        .setting-item {
          margin: 15px auto;
        }

        .setting-desc {
          width: 300px;
        }

        paper-material > div {
          padding: 15px;
        }

      `]}render(){return _backendAiConsole.html$4`
      <paper-material elevation="1">
        <h3 class="horizontal center layout">
          <span>General</span>
          <span class="flex"></span>
        </h3>

        <h4>Fix</h4>
        <div>
          <div class="horizontal flex layout wrap setting-item">
            <div class="vertical center-justified layout setting-desc">
              <div>Match usage database with current state</div>
              <div class="description">Recalculate usage database with current state.<br/>
                Useful if docker fails by accident, or some sessions have been forcibly terminated.
              </div>
            </div>
            <div class="vertical center-justified layout">
              <mwc-button class="fg red" outlined label="Recalculate usage" icon="refresh"></mwc-button>
            </div>
          </div>
        </div>
        <h4>Images / Environment</h4>
        <div>
          <div class="horizontal flex layout wrap setting-item">
            <div class="vertical center-justified layout setting-desc">
              <div>Rescan image list from repository</div>
              <div class="description">Rescan image list from registered repositories.
              </div>
            </div>
            <div class="vertical center-justified layout">
              <mwc-button class="fg red" outlined label="Rescan images" icon="refresh"></mwc-button>
            </div>
          </div>
          <div class="horizontal flex layout wrap setting-item">
            <div class="vertical center-justified layout setting-desc">
              <div>Clean up old images</div>
              <div class="description">Clean up old images from docker image list.
              </div>
            </div>
            <div class="vertical center-justified layout">
              <mwc-button class="fg red" outlined label="Clean up images" icon="delete"></mwc-button>
            </div>
          </div>
        </div>
      </paper-material>
    `}static get properties(){return{active:{type:Boolean},images:{type:Object,hasChanged:()=>!0}}}constructor(){super();(0,_backendAiConsole.setPassiveTouchGestures)(!0);this.images={};this.active=!1}shouldUpdate(){return this.active}firstUpdated(){if(window.backendaiclient===void 0||null===window.backendaiclient){document.addEventListener("backend-ai-connected",()=>{},!0)}else{}}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}_indexFrom1(index){return index+1}}customElements.define(BackendAiMaintenanceView.is,BackendAiMaintenanceView)});