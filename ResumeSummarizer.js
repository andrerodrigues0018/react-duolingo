import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const ResumeSummarizer = () => {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    if (result.canceled != 'false') {
      setFile(result.assets[0]);
      console.log('File selected:', result.assets[0]);
    }
  };

  const uploadPDF = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const responseUpload = await axios.post('https://pdf-curriculo.onrender.com/upload-pdf', uint8Array, {
        headers: {
          'Content-Type': 'application/pdf',
          'User-Agent': 'insomnia/2023.5.8',
        },
      });

      setMarkdown(responseUpload.data);
      console.log('Response data:', responseUpload.data);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar PDF" onPress={pickDocument} />
      {file && <Text>Arquivo selecionado: {file.name}</Text>}
      <Button title="Enviar PDF" onPress={uploadPDF} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {markdown && (
        <ScrollView style={styles.markdownContainer}>
          <Text style={styles.markdownText}>Nome: {markdown.nome}</Text>
          <Text style={styles.markdownText}>Email: {markdown.email} | TEL: {markdown.telefone} </Text>
          <Text style={styles.markdownText}>Objetivo: {markdown.posicao} </Text>
          <Text style={styles.markdownText}>
            Educação:
            <hr/>
            {markdown.educacao.map((educacao, index) => (
              <div key={index}>
                <Text>Curso: {educacao.curso}</Text><br/>
                <Text>data: {educacao.data}</Text><br/>
                <Text>Instituição: {educacao.instituicao}</Text>             
                <hr/>
              </div>

            ))}
          </Text>
          <Text style={styles.markdownText}>
            Experiencia
            <hr/>
            {markdown.experiencias.map((experiencia, index) => (
              <div key={index}>
                <Text>empresa: {experiencia.empresa}</Text><br/>
                <Text>local: {experiencia.local}</Text><br/>
                <Text>periodo: {experiencia.periodo}</Text><br/>
                <Text>titulo: {experiencia.titulo}</Text><br/>
                <hr/>

              </div>
            ))}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  markdownContainer: {
    marginTop: 20,
    width: '100%',
  },
  markdownText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ResumeSummarizer;