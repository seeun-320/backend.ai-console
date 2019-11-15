/**
 @license
 Copyright (c) 2015-2019 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, property} from "lit-element";
import {BackendAIPage} from './backend-ai-page';

import {setPassiveTouchGestures} from '@polymer/polymer/lib/utils/settings';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';

import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-slider/paper-slider';
import '@polymer/paper-item/paper-item';

import Sortable from 'sortablejs';
import '@vaadin/vaadin-dialog/vaadin-dialog';
import 'weightless/button';
import 'weightless/icon';
import 'weightless/dialog';
import 'weightless/expansion';
import 'weightless/card';
import 'weightless/tab';
import 'weightless/tab-group';
import 'weightless/list-item';
import 'weightless/divider';
import 'weightless/textfield';

import {BackendAiStyles} from './backend-ai-console-styles';
import {
  IronFlex,
  IronFlexAlignment,
  IronFlexFactors,
  IronPositioning
} from '../plastics/layout/iron-flex-layout-classes';
import {default as PainKiller} from './backend-ai-painkiller';
import './backend-ai-session-list';
import './backend-ai-dropdown-menu';
import './lablup-codemirror';
import './lablup-loading-indicator';

@customElement("backend-ai-pipeline-view")
export default class BackendAIPipelineView extends BackendAIPage {
  public resourceLimits: any;
  public userResourceLimit: any;
  public gpu_mode: any;
  public gpu_step: any;
  public cpu_metric: any;
  public mem_metric: any;
  public gpu_metric: any;
  public tpu_metric: any;
  public images: any;
  public defaultResourcePolicy: any;
  public total_slot: any;
  public used_slot: any;
  public available_slot: any;
  public resource_info: any;
  public used_slot_percent: any;
  public resource_templates: any;
  public vfolders: any;
  public launch_ready: any;
  public concurrency_used: any;
  public concurrency_max: any;
  public _status: any;
  public notification: any;
  public shadowRoot: any;
  public updateComplete: any;
  public vgpu_metric: any;
  public $: any;

  public indicator: any;

  @property({type: Object}) supports = Object();
  @property({type: Object}) aliases = Object();
  @property({type: Object}) tags = Object();
  @property({type: Object}) humanizedNames = Object();
  @property({type: Array}) versions = Array();
  @property({type: Array}) languages = Array();
  @property({type: String}) defaultLanguage = '';
  @property({type: String}) scalingGroup = '';
  @property({type: Array}) scalingGroups = Array();
  @property({type: String}) vhost = '';
  @property({type: Array}) vhosts = Array();
  @property({type: Array}) pipelineList = Array();
  @property({type: Object}) pipelineConfig = Object();
  @property({type: Array}) pipelineComponents = Array();
  @property({type: String}) pipelineMode = 'create';

  constructor() {
    super();
    setPassiveTouchGestures(true);
    this.active = false;
    this.supports = {};
    this.resourceLimits = {};
    this.userResourceLimit = {};
    this.aliases = {
      'TensorFlow': 'python-tensorflow',
      'Lablup ResearchEnv.': 'python-ff',
      'Python': 'python',
      'PyTorch': 'python-pytorch',
      'Chainer': 'chainer',
      'R': 'r',
      'Julia': 'julia',
      'Lua': 'lua',
    };
    this.versions = [];
    this.languages = [];
    this.gpu_mode = 'no';
    this.gpu_step = 0.05;
    this.cpu_metric = {
      'min': '1',
      'max': '1'
    };
    this.mem_metric = {
      'min': '1',
      'max': '1'
    };
    this.gpu_metric = {
      'min': '0',
      'max': '0'
    };
    this.tpu_metric = {
      'min': '1',
      'max': '1'
    };
    this.images = {};
    this.defaultResourcePolicy = 'UNLIMITED';
    this.total_slot = {};
    this.used_slot = {};
    this.available_slot = {};
    this.resource_info = {};
    this.used_slot_percent = {};
    this.resource_templates = [];
    this.vfolders = [];
    this.defaultLanguage = '';
    this.launch_ready = false;
    this.concurrency_used = 0;
    this.concurrency_max = 0;
    this._status = 'inactive';

    this.pipelineConfig = {
      title: '',
      description: '',
      environment: '',
      version: '',
      scaling_group: '',
      folder_host: '',
    }
    this.pipelineComponents = [
      {
        'title': 'Backend.AI Data Uploader',
        'description': 'Backend.AI data uploader helps users uploading the data to experiment store',
        'code': 'import tensorflow as tf\nprint(tf.__version__)',
        'cpu': 1,
        'mem': 1,
        'gpu': 0
      },
      {
        'title': 'Facet',
        'description': 'Facets contains two robust visualizations to aid in understanding and analyzing',
        'code': 'print("Facet")',
        'cpu': 1,
        'mem': 1,
        'gpu': 0
      },
      {
        'title': 'TensorFlow',
        'description': 'TensorFlow is an end-to-end open source platform for machine learning',
        'code': 'print("TensorFlow")',
        'cpu': 4,
        'mem': 16,
        'gpu': 1.5
      },
      {
        'title': 'TensorFlow Validate',
        'code': 'print("TensorFlow Validate")',
        'description': 'TensorFlow is an end-to-end open source platform for machine learning',
        'cpu': 4,
        'mem': 16,
        'gpu': 1.5
      },
      {
        'title': 'TensorFlow Serving',
        'description': 'TensorFlow is an end-to-end open source platform for machine learning',
        'code': 'print("TensorFlow Serving")',
        'cpu': 1,
        'mem': 1,
        'gpu': 0
      },
    ];
    // this.pipelineSortable = {};
  }

  static get styles() {
    return [
      BackendAiStyles,
      IronFlex,
      IronFlexAlignment,
      IronFlexFactors,
      IronPositioning,
      // language=CSS
      css`
        wl-card h4 {
          padding: 5px 20px;
          border-bottom: 1px solid #dddddd;
          font-weight: 100;
        }

        wl-card h3.tab {
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
        }

        .indicator {
          font-family: monospace;
        }

        wl-button.button {
          --button-bg: var(--paper-blue-50);
          --button-bg-hover: var(--paper-blue-100);
          --button-bg-active: var(--paper-blue-600);
        }

        wl-button.launch-button {
          width: 335px;
          --button-bg: var(--paper-blue-50);
          --button-bg-hover: var(--paper-blue-100);
          --button-bg-active: var(--paper-blue-600);
        }

        #exp-sidebar {
          weight: 300px;
          border-right: 1px solid #ccc;
          height: calc(100vh - 235px);
        }

        .sidebar-item {
          width: 400px;
        }

        #pipeline-create-dialog {
          --dialog-min-width: 400px;
          --dialog-max-width: 600px;
          --dialog-min-height: 600px;
          --dialog-max-height: 700px;
        }

        #codemirror-dialog {
          --dialog-min-width: calc(100vw - 200px);
          --dialog-max-width: calc(100vw - 200px);
          --dialog-min-height: calc(100vh - 100px);
          --dialog-max-height: calc(100vh - 100px);
        }
      `];
  }

  firstUpdated() {
    fetch('resources/image_metadata.json').then(
      response => response.json()
    ).then(
      json => {
        this.aliases = json.aliases;
        this.tags = json.tags;
        this.humanizedNames = json.humanizedNames;
      }
    );
    this.shadowRoot.querySelector('#pipeline-environment').addEventListener('selected-item-label-changed', this.updateLanguage.bind(this));
    this._refreshImageList();
    this._fetchResourceGroup();

    this.notification = window.lablupNotification;
    this.indicator = this.shadowRoot.querySelector('#loading-indicator');
  }

  async _viewStateChanged(active) {
    await this.updateComplete;
    if (active === false) {
      return;
    }
    if (typeof window.backendaiclient === "undefined" || window.backendaiclient === null || window.backendaiclient.ready === false) {
      document.addEventListener('backend-ai-connected', () => {
        this._fetchPipelineFolders();
        this._makeSortablePipelineComponents();
      }, true);
    } else {
      this._fetchPipelineFolders();
      this._makeSortablePipelineComponents();
    }
  }

  _showTab(tab) {
    var els = this.shadowRoot.querySelectorAll(".tab-content");
    for (var x = 0; x < els.length; x++) {
      els[x].style.display = 'none';
    }
    this.shadowRoot.querySelector('#' + tab.value).style.display = 'block';
  }

  _fetchPipelineFolders() {
    this.indicator.show();
    window.backendaiclient.vfolder.list()
        .then((folders) => {
          const pipelines: Array<object> = [];
          folders.forEach((folder) => {
            if (folder.name.startsWith('pipeline-')) pipelines.push(folder);
          });
          this.pipelineList = pipelines;
          // TODO: read pipeline configs
          this.indicator.hide();
        });
  }

  updateLanguage() {
    let selectedItem = this.shadowRoot.querySelector('#pipeline-environment').selectedItem;
    if (selectedItem === null) return;
    let kernel = selectedItem.id;
    this._updateVersions(kernel);
  }

  _updateVersions(kernel) {
    if (kernel in this.supports) {
      this.versions = this.supports[kernel];
      this.versions.sort();
      this.versions.reverse(); // New version comes first.
    }
    if (this.versions !== undefined) {
      this.shadowRoot.querySelector('#pipeline-environment-tag').value = this.versions[0];
      // this.updateMetric('update versions');
    }
  }

  _refreshImageList() {
    const fields = [
      'name', 'humanized_name', 'tag', 'registry', 'digest', 'installed',
      'resource_limits { key min max }'
    ];
    window.backendaiclient.image.list(fields, true).then((response) => {
      const images: Array<object> = [];
      Object.keys(response.images).map((objectKey, index) => {
        const item = response.images[objectKey];
        if (item.installed === true) {
          images.push(item);
        }
      });
      if (images.length === 0) {
        return;
      }
      this.images = images;
      this.supports = {};
      Object.keys(this.images).map((objectKey, index) => {
        const item = this.images[objectKey];
        const supportsKey = `${item.registry}/${item.name}`;
        if (!(supportsKey in this.supports)) {
          this.supports[supportsKey] = [];
        }
        this.supports[supportsKey].push(item.tag);
        this.resourceLimits[`${supportsKey}:${item.tag}`] = item.resource_limits;
      });
      this._updateEnvironment();
    }).catch((err) => {
      // this.metadata_updating = false;
      if (err && err.message) {
        this.notification.text = PainKiller.relieve(err.title);
        this.notification.detail = err.message;
        this.notification.show(true);
      }
    });
  }

  async _fetchResourceGroup() {
    const currentGroup = window.backendaiclient.current_group || null;
    let sgs = await window.backendaiclient.scalingGroup.list(currentGroup);
    this.scalingGroups = sgs.scaling_groups;
    this.scalingGroup = sgs.scaling_groups[0].name;
  }

  _updateEnvironment() {
    // this.languages = Object.keys(this.supports);
    // this.languages.sort();
    const langs = Object.keys(this.supports);
    if (langs === undefined) return;
    langs.sort();
    this.languages = [];
    langs.forEach((item, index) => {
      if (!(Object.keys(this.aliases).includes(item))) {
        const humanizedName = this._guessHumanizedNames(item);
        if (humanizedName !== null) {
          this.aliases[item] = humanizedName;
        } else {
          this.aliases[item] = item;
        }
      }
      let specs = item.split('/');
      let registry = specs[0];
      let prefix, kernelName;
      if (specs.length == 2) {
        prefix = '';
        kernelName = specs[1];
      } else {
        prefix = specs[1];
        kernelName = specs[2];
      }
      const alias = this.aliases[item];
      let basename;
      if (alias !== undefined) {
        basename = alias.split(' (')[0];
      } else {
        basename = kernelName;
      }
      let tags: string[] = [];
      if (alias in this.tags) {
        tags = tags.concat(this.tags[alias]);
      }
      if (prefix != '') {
        tags.push(prefix);
      }
      this.languages.push({
        name: item,
        registry: registry,
        prefix: prefix,
        kernelname: kernelName,
        alias: alias,
        basename: basename,
        tags: tags
      });
    });
    this._initAliases();
  }

  _guessHumanizedNames(kernelName) {
    const candidate = this.humanizedNames;
    let imageName = '';
    let humanizedName = null;
    let matchedString = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()';
    Object.keys(candidate).forEach((item, index) => {
      let specs = kernelName.split('/');
      if (specs.length == 2) {
        imageName = specs[1];
      } else {
        imageName = specs[2];
      }
      if (imageName === item) {
        humanizedName = candidate[item];
        matchedString = item;
      } else if (imageName === '' && kernelName.endsWith(item) && item.length < matchedString.length) {
        humanizedName = candidate[item];
        matchedString = item;
      }
    });
    return humanizedName;
  }

  selectDefaultLanguage() {
    if (typeof window.backendaiclient === "undefined" || window.backendaiclient === null || window.backendaiclient.ready === false) {
      document.addEventListener('backend-ai-connected', () => {
        this._selectDefaultLanguage();
      }, true);
    } else {
      this._selectDefaultLanguage();
    }
  }

  _selectDefaultLanguage() {
    if (window.backendaiclient._config.default_session_environment !== undefined &&
      'default_session_environment' in window.backendaiclient._config &&
      window.backendaiclient._config.default_session_environment !== '') {
      this.defaultLanguage = window.backendaiclient._config.default_session_environment;
    } else if (this.languages.length !== 0) {
      this.defaultLanguage = this.languages[0].name;
    } else {
      this.defaultLanguage = 'index.docker.io/lablup/ngc-tensorflow';
    }
    return true;
  }


  _initAliases() {
    for (let item in this.aliases) {
      this.aliases[this.aliases[item]] = item;
    }
  }

  _openPipelineCreateDialog() {
    this.selectDefaultLanguage();
    window.backendaiclient.vfolder.list_hosts()
        .then((resp) => {
          const listbox = this.shadowRoot.querySelector('#pipeline-folder-host paper-listbox');
          this.vhosts = resp.allowed.slice();
          this.vhost = resp.default;
          listbox.selected = this.vhost;
        })
        .catch((err) => {
          if (err && err.message) {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
            this.notification.show(true);
          }
        });
    this.shadowRoot.querySelector('#pipeline-create-dialog').show();
  }

  _hidePipelineCreateDialog() {
    const dialog = this.shadowRoot.querySelector('#pipeline-create-dialog');
    dialog.hide();
  }

  _createPipeline() {
    const title = this.shadowRoot.querySelector('#pipeline-title').value;
    const description = this.shadowRoot.querySelector('#pipeline-description').value;
    const environment = this.shadowRoot.querySelector('#pipeline-environment').value;
    const version = this.shadowRoot.querySelector('#pipeline-environment-tag').value;
    const scaling_group = this.shadowRoot.querySelector('#pipeline-scaling-group').value;
    const folder_host = this.shadowRoot.querySelector('#pipeline-folder-host').value;
    const folder_name = `pipeline-${window.backendaiclient.slugify(title)}-${window.backendaiclient.generateSessionId(8, true)}`;
    if (!title || !environment || !version || !scaling_group || !folder_host) {
      this.notification.text = 'Fill all input fields';
      this.notification.show();
      return;
    }
    const configObj = {
      title, description, environment, version, scaling_group, folder_host, folder_name
    }
    this.indicator.show();
    window.backendaiclient.vfolder.create(folder_name, folder_host)
        .then((resp) => {
          this.notification.text = 'Pipeline created';
          this.notification.show();
          this._fetchPipelineFolders();
          this._updatePipelineConfig(configObj);
          this._hidePipelineCreateDialog();
          this.indicator.hide();
        })
        .catch((err) => {
          if (err && err.message) {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
            this.notification.show(true);
          }
          this.indicator.hide();
        });
  }

  _openPipelineUpdateDialog(vfinfo) {
    window.backendaiclient.vfolder.list_hosts()
        .then((resp) => {
          const listbox = this.shadowRoot.querySelector('#pipeline-folder-host paper-listbox');
          this.vhosts = resp.allowed.slice();
          listbox.selected = this.vhost;
        })
        .catch((err) => {
          if (err && err.message) {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
            this.notification.show(true);
          }
        });
    this.shadowRoot.querySelector('#pipeline-create-dialog').show();
  }

  _updatePipeline(vfinfo) {
    console.log(vfinfo)
  }

  _selectPipeline() {
  }

  _updatePipelineConfig(configObj) {
    const configPath = 'pipeline/config.json'
    const blob = new Blob([JSON.stringify(configObj)], {type: 'application/json'})
    window.backendaiclient.vfolder.upload(configPath, blob, configObj.folder_name)
        .then((resp) => {
        })
        .catch((err) => {
            this.notification.text = PainKiller.relieve(err.title);
            this.notification.detail = err.message;
            this.notification.show(true);
        });
  }

  _readPipelineConfig() {
  }

  _uploadPipelineFile() {
  }

  _downloadPipelineFile() {
  }

  _makeSortablePipelineComponents() {
    const el = this.shadowRoot.querySelector('#pipeline-component-list');
    // this.pipelineSortable = Sortable.create(el);
    Sortable.create(el);
  }

  _editCode(pipelineComponent) {
    const editor = this.shadowRoot.querySelector('#codemirror-editor');
    editor.setValue(pipelineComponent.code);
    const dialog = this.shadowRoot.querySelector('#codemirror-dialog');
    dialog.querySelector('div[slot="header"]').textContent = pipelineComponent.title;
    dialog.show();
  }

  _hideCodeDialog() {
    const codemirrorEl = this.shadowRoot.querySelector('#codemirror-dialog');
    codemirrorEl.hide();
  }

  _runComponentCode() {
    console.log('# _runComponentCode');
  }

  render() {
    // language=HTML
    return html`
      <wl-card class="item" elevation="1">
        <h3 class="tab horizontal center layout">
          <wl-tab-group>
            <wl-tab value="exp-lists" checked @click="${(e) => this._showTab(e.target)}">List</wl-tab>
            <wl-tab value="running-lists" @click="${(e) => this._showTab(e.target)}">Running</wl-tab>
            <wl-tab value="finished-lists" @click="${(e) => this._showTab(e.target)}">Finished</wl-tab>
          </wl-tab-group>
          <span class="flex"></span>
          <wl-button class="fg blue button" id="add-experiment" outlined
              @click="${this._openPipelineCreateDialog}">
            <wl-icon>add</wl-icon>
            Add pipeline
          </wl-button>
        </h3>
        <div id="exp-lists" class="tab-content" style="margin:0;padding:0;height:calc(100vh - 235px);">
          <div class="horizontal wrap layout" style="margin:0;padding:0;">
            <div id="exp-sidebar">
              <h4>Pipeline</h4>
              ${this.pipelineList.map((item) => html`
                <wl-list-item class="sidebar-item">
                  <div slot="before">
                    <iron-icon icon="vaadin:flask"></iron-icon>
                    <paper-icon-button slot="before" class="fg black pipeline-edit-button"
                        icon="vaadin:edit" @click="${() => this._updatePipeline(item)}"></paper-icon-button>
                  </div>
                  <span slot="after">5<br/><span style="font-size:9px">components</span></span>
                  <wl-title level="4" style="margin: 0">${item.name}</wl-title>
                  <span style="font-size: 11px;">Test experiment</span>
                </wl-list-item>
              `)}
              ${this.pipelineList.length < 1 ? html`<div style="margin-left:1em;">No pipeline.</span>` : ''}
              <h4>Templates</h4>
              <wl-list-item class="sidebar-item">
                <iron-icon icon="vaadin:flask" slot="before"></iron-icon>
                  <span slot="after">5<br/><span style="font-size:9px">components</span></span>
                  <wl-title level="4" style="margin: 0">Example Experiment (TensorFlow)</wl-title>
                  <span style="font-size: 11px;">Basic experiment example using TensorFlow</span>
              </wl-list-item>
              <wl-list-item class="sidebar-item">
                <iron-icon icon="vaadin:flask" slot="before"></iron-icon>
                  <span slot="after">4<br/><span style="font-size:9px">components</span></span>
                  <wl-title level="4" style="margin: 0">Example Experiment (PyTorch)</wl-title>
                  <span style="font-size: 11px;">Basic experiment example using Pytorch</span>
              </wl-list-item>
              <wl-list-item class="sidebar-item">
                <iron-icon icon="vaadin:flask" slot="before"></iron-icon>
                  <span slot="after">4<br/><span style="font-size:9px">components</span></span>
                  <wl-title level="4" style="margin: 0">Facet data cleaner</wl-title>
                  <span style="font-size: 11px;">Data preprocessing using Facet</span>
              </wl-list-item>
            </div>
            <div class="layout vertical">
              <div class="layout horizontal" style="padding:0 20px">
                ${this.pipelineConfig.environment && this.pipelineConfig.version ? html`
                  <span>Environment: ${this.pipelineConfig.environment}:${this.pipelineConfig.version}</span>
                ` : ''}
                ${this.pipelineConfig.scaling_group ? html`
                  <span>Scaling group: ${this.pipelineConfig.scaling_group}</span>
                ` : ''}
                ${this.pipelineConfig.folder_host ? html`
                  <span>Folder host: ${this.pipelineConfig.folder_host}</span>
                ` : ''}
              </div>
              <div id="pipeline-component-list">
                ${this.pipelineComponents.map((item) => html`
                  <wl-list-item style="width:calc(100%-55px); height:80px">
                    <iron-icon icon="vaadin:puzzle-piece" slot="before"></iron-icon>
                    <div slot="after">
                      <div class="horizontal layout">
                        <div class="layout horizontal center" style="width:100px;">
                            <paper-icon-button class="fg black" icon="vaadin:edit" @click="${() => this._editCode(item)}"></paper-icon-button>
                            <paper-icon-button class="fg black" icon="vaadin:controller"></paper-icon-button>
                        </div>
                        <div class="layout vertical start flex" style="width:80px!important;">
                          <div class="layout horizontal configuration">
                            <iron-icon class="fg blue" icon="hardware:developer-board"></iron-icon>
                            <span>${item.cpu}</span>
                            <span class="indicator">core</span>
                          </div>
                          <div class="layout horizontal configuration">
                            <iron-icon class="fg blue" icon="hardware:memory"></iron-icon>
                            <span>${item.mem}</span>
                            <span class="indicator">GB</span>
                          </div>
                          <div class="layout horizontal configuration">
                            <iron-icon class="fg blue" icon="icons:view-module"></iron-icon>
                            <span>${item.gpu}</span>
                            <span class="indicator">GPU</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <wl-title level="4" style="margin: 0">${item.title}</wl-title>
                    <div style="font-size:11px;max-width:400px;">${item.description}</div>
                  </wl-list-item>
                `)}
              </div>
              <wl-button class="fg blue button" id="add-component" outlined>
                <wl-icon>add</wl-icon>
                Add component
              </wl-button>
            </div>
          </div>
        </div>
        <div id="running-lists" class="tab-content" style="display:none;">
          <backend-ai-session-list id="running-jobs" condition="running" ?active="${this._status === 'active'}"></backend-ai-session-list>
        </div>
        <div id="finished-lists" class="tab-content" style="display:none;">
          <backend-ai-session-list id="finished-jobs" condition="finished" ?active="${this._status === 'active'}"></backend-ai-session-list>
        </div>
      </wl-card>

      <wl-dialog id="pipeline-create-dialog" fixed blockscrolling backdrop persistent>
        <div slot="header">${this.pipelineMode === 'create' ? 'Create' : 'Update'} pipeline config</div>
        <div slot="content">
          <wl-textfield id="pipeline-title" label="Pipeline title" maxLength="30"></wl-textfield>
          <wl-textfield id="pipeline-description" label="Pipeline description" maxLength="200"></wl-textfield>
          <div class="layout horizontal">
            <paper-dropdown-menu id="pipeline-environment" label="Environments" horizontal-align="left">
              <paper-listbox slot="dropdown-content" attr-for-selected="id"
                             selected="${this.defaultLanguage}">
                ${this.languages.map(item => html`
                  <paper-item id="${item.name}" label="${item.alias}">${item.basename}
                    ${item.tags ? item.tags.map(item => html`
                      <lablup-shields style="margin-left:5px;" description="${item}"></lablup-shields>
                    `) : ''}
                  </paper-item>
                `)}
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-dropdown-menu id="pipeline-environment-tag" label="Version">
              <paper-listbox slot="dropdown-content" selected="0">
                ${this.versions.map(item => html`
                  <paper-item id="${item}" label="${item}">${item}</paper-item>
                `)}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          <div class="layout horizontal">
            <paper-dropdown-menu id="pipeline-scaling-group" label="Resource Group" horizontal-align="left">
              <paper-listbox selected="${this.scalingGroup}" slot="dropdown-content" attr-for-selected="id">
                ${this.scalingGroups.map(item => html`
                  <paper-item id="${item.name}" label="${item.name}">${item.name}</paper-item>
                `)}
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-dropdown-menu id="pipeline-folder-host" label="Folder host">
              <paper-listbox slot="dropdown-content" attr-for-selected='label'>
                ${this.vhosts.map(item => html`
                  <paper-item label="${item}">${item}</paper-item>
                `)}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
        </div>
        <div slot="footer">
          <wl-button inverted flat id="" @click="${this._hidePipelineCreateDialog}">Cancel</wl-button>
          <wl-button type="submit" id="create-pipeline-button" @click="${this._createPipeline}">
            ${this.pipelineMode === 'create' ? 'Create' : 'Update'}
          </wl-button>
        </div>
      </wl-dialog>

      <wl-dialog id="codemirror-dialog" fixed backdrop scrollable blockScrolling persistent>
        <div slot="header"></div>
        <div slot="content">
          <lablup-codemirror id="codemirror-editor"></lablup-codemirror>
        </div>
        <div slot="footer">
          <wl-button inverted flat id="discard-code" @click="${this._hideCodeDialog}">Cancel</wl-button>
          <wl-button id="save-code" disabled>Save</wl-button>
        </div>
      </wl-dialog>

      <lablup-loading-indicator id="loading-indicator"></lablup-loading-indicator>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-pipeline-view": BackendAIPipelineView;
  }
}
