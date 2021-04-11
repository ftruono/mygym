import React, { useReducer } from "react";
import { StyleSheet, View, Button, Text, SafeAreaView, ScrollView, Dimensions, FlatList } from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';
import DietaComponent from "../../component/DietaComponent";
import HeaderComponent from "../../component/HeaderComponent";
import { Firestore, FirebaseAutentication } from "../../config/FirebaseConfig";
import sendEmail from 'react-native-email';


const { width, height } = Dimensions.get('screen');
class Dieta extends React.Component {
    constructor(props) {
            super(props);
            this.getUserAndDiete()
        }
    
        state = {
            diete:[],
            pasti:[],
            noDiete:false
        }
    
        getUserAndDiete = async () => {
            var uid = FirebaseAutentication.currentUser.uid
            const user = (await Firestore.collection('UTENTI').doc(uid).get()).data();
            this.setState({diete:user.diete})
            if(this.state.diete[0] !== undefined) {
                const pastiData =(await Firestore.collection('DIETE').doc(this.state.diete[0]).get()).data();
                this.state.pasti.push(pastiData);
                var support = this.state.pasti;
                this.setState({ pasti: support });
                console.log(this.state.pasti)
            } else {
                this.setState({noDiete:true})
            }
             
        }


      
    
        
        render() {

            const handleEmailNutri = () => {
                const to = ['liguorinovincenzo0@gmail.com'] // string or array of email addresses
                  sendEmail(to, {
                      cc: ['Nutri0', 'Nutri1'], // string or array of email addresses
                      
                      subject: 'Richiesta Affiliazione Nutrizionista',
                      body: 'Ciao sono un nuovo cliente dell applicazione e avrei bisogno di un Nutrizionista che mi segua. Saluti'
          
                  }).catch(console.error)
              }
        
            if(this.state.noDiete == false) {
                var pastiArray=[];
                var contentArray=[];
                this.state.pasti.map((item,i) => {
                    console.log(item)
                    pastiArray.push(item.valori)
                })
                if(this.state.pasti.length == 0) {
                    return null
                } else{
                    console.log("Sono qui")
                    pastiArray = (Object.values(pastiArray))
    
                    pastiArray.map((lista,i) => {
                        lista.map((element,i) => {
                            contentArray.push({nome: element.tipo, contenuto:element.valore});
                        })
                    })
                    console.log(contentArray)
                    console.log(pastiArray)
                }
            }
        return (

            <SafeAreaView style={styles.home}>

                { this.props.isComponent ? (
                    null
                ) : <HeaderComponent {...this.props} title="Dieta"/>}


                        {this.state.noDiete ? (
                            <>
                                <Text style={styles.titleSubParagraph}> Non hai ancora una dieta assegnata</Text>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                    <Text style={styles.titleThParagraph}> Fatti aiutare da un nostro</Text>
                                    <Text style={styles.titleLink} onPress={() => handleEmailNutri()}> Nutrizionista</Text>
                                </View>
                            </>
                        ):(
                            <>
                            
                                <FlatList style={{ margin: 10, flex: 0.8, alignContent: 'center' }}
                                    data={contentArray}
                                    scrollEnabled={true}
                                    numColumns={2}
                                    keyExtractor={(item) => item.nome}
                                    renderItem={({ item }) => (
                                        <DietaComponent {...this.props} item={item} key={item.nome} />
                                    )}
                                />
                            </>
                    )}
            </SafeAreaView>
        );
    }
}

export default Dieta;

const styles = StyleSheet.create({
    home: {
        flex: 1,
        alignItems: 'stretch'
    },
    titleSubParagraph: {
        fontSize:15,
        fontWeight:'bold',
        textAlign:'center',
        marginTop:50
     },
     titleThParagraph: {
         fontSize:15,
         fontWeight:'bold',
         textAlign:'center',
         marginTop:15
      },
      titleLink:{
        color: 'blue',
        fontSize:15,
        fontWeight:'bold',
        textAlign:'center',
        marginTop:15,
        textDecorationLine: 'underline'
      }

});