import { MainModel } from '../models/MainModel';
import { AboutSectionView } from './AboutSectionView';
import { FilterModalView } from './FilterModalView';
import { ISection } from './ISection';
import { NavigationView } from './NavigationView';
import { ProgressModalView } from './ProgressModalView';
import { ScreenerSectionView } from './ScreenerSectionView';
import { SettingsModalView } from './SettingsModalView';
import { SignalSectionView } from './SignalsSectionView';
import { SortModalView } from './SortModalView';
import { StartSectionView } from './StartSectionView';


export class MainView {
    startSection: StartSectionView;
    screenerSection: ScreenerSectionView;
    aboutSection: AboutSectionView;
    signalsSection: SignalSectionView;
    navigation: NavigationView;
    sortModalView: SortModalView;
    filterModalView: FilterModalView;
    progressModalView: ProgressModalView;
    settingsModalView: SettingsModalView;
    sections: readonly ISection[];
    model: MainModel;
    constructor(model: MainModel) {
        this.model = model;
        this.startSection = new StartSectionView();
        this.screenerSection = new ScreenerSectionView();
        this.navigation = new NavigationView();
        this.sortModalView = new SortModalView();
        this.progressModalView = new ProgressModalView();
        this.aboutSection = new AboutSectionView();
        this.settingsModalView = new SettingsModalView();
        this.filterModalView = new FilterModalView();
        this.signalsSection = new SignalSectionView();
        this.screenerSection.hide();
        this.navigation.hide();
        this.sortModalView.hide();
        this.settingsModalView.hide();
        this.progressModalView.hide();
        this.filterModalView.hide();
        this.aboutSection.hide();
        this.signalsSection.hide();
        this.startSection.show();
        this.sections = [this.startSection, this.screenerSection, this.signalsSection, this.aboutSection];
    }



    findSectionById(aSectionId: string) {
        let found = this.sections.find(section => section.id === aSectionId);
        if (!found) {
            throw new Error(`Section with id ${aSectionId} not found.`);
        }
        return found;
    }

    showSection(aSection: ISection) {
        aSection.show();
        this.sections.forEach(currentSection => {
            if (aSection.id === currentSection.id) {
                return;
            }
            currentSection.hide();
        });
    }


}
