### data.json data structure
- Texts are organized by language _it_ and _en_
- To show a remote contextual help and faq group on the APP add a new entry in screens array as follows:
    - ````
      {
        "route_name": "BPD_INFORMATION_TOS",
        "title": "Programma Cashback",
        "content": "Qui sono visualizzate tutte le informazioni relative al Cashback, il provvedimento istituito dal Ministero dell'Economia e delle Finanze per incentivare l'utilizzo della moneta elettronica anche per piccole somme.",
        "faqs": [
          {
            "title": "Come faccio a richiedere il Cashback?",
            "body": "Se sei maggiorenne e risiedi in Italia, semplicemente premi sul pulsante 'Attiva il Cashback' in fondo alla pagina e segui il flusso che ti viene proposto.\nA seguito dell'autodichiarazione, ti verrà chiesto di:\n- inserire un IBAN, che utilizzeremo a fine periodo per rimborsarti eventuali importi accumulati;\n- aggiungere metodi di pagamento elettronici (o attivare quelli già presenti nel tuo portafoglio).\n\nEntrambi i passaggi sono facoltativi, ma ti consigliamo di effettuarli subito per evitare di dimenticarti e iniziare quanto prima ad accumulare transazioni valide."
          },
          {
            "title": "Cosa serve per richiedere il Cashback?",
            "body": "Devi essere maggiorenne, risiedere in Italia e avere almeno un IBAN a te intestato o cointestato e almeno un metodo di pagamento elettronico."
          },
          {
            "title": "Ci sono limiti di reddito? Serve presentare una DSU per il calcolo dell’ISEE per accedere al Cashback?",
            "body": "No, l’erogazione dei rimborsi previsti dal programma non è legata in alcun modo al reddito né alla situazione patrimoniale dei partecipanti."
          },
          {
            "title": "Possono partecipare tutti i componenti maggiorenni dello stesso nucleo familiare?",
            "body": "Per aderire al Cashback non c’è un limite al numero di partecipanti per nucleo familiare. Ogni componente maggiorenne e residente in Italia può iscriversi individualmente al programma e ricevere il proprio rimborso."
          },
          {
            "title": "Posso partecipare al Cashback anche con una carta intestata a un'altra persona?",
            "body": "Devi essere tu il titolare dei metodi di pagamento elettronico su cui attivi il Cashback. Inoltre, anche nel caso in cui lo stesso metodo di pagamento sia cointestato, solo uno dei titolari può concorrere al programma con quello strumento."
          }
        ]
      },
      ````
    - **route_name** is the screen route defined in app
    - **title** is the contextual help title
    - **content** is the body text of the contextual help
    - **faqs** is the collection faqs to display in the related app route
      - **title** is the faq title, showed on the anchor link
      - **body** is the faq content, showed after the anchor is opened
