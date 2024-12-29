import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import QuestionGenerator from './QuestionGenerator';
import ResumeSummarizer from './ResumeSummarizer';

export default function App() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'questions', title: 'Gerador de Questões' },
    { key: 'resume', title: 'Currículo Resumidor' },
  ]);

  const renderScene = SceneMap({
    questions: QuestionGenerator,
    resume: ResumeSummarizer,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}