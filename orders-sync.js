// Script para sincronizar pedidos entre localStorage e arquivo JSON
// Este script pode ser executado no console do navegador para sincronizar dados

class OrdersSync {
    constructor() {
        this.databaseFile = '../orders.json';
        this.localStorageKey = 'ordersDatabase';
    }

    // Carregar dados do arquivo JSON
    async loadFromFile() {
        try {
            const response = await fetch(this.databaseFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar do arquivo:', error);
            return null;
        }
    }

    // Carregar dados do localStorage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(this.localStorageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    // Salvar dados no localStorage
    saveToLocalStorage(data) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(data));
            console.log('Dados salvos no localStorage com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    // Migrar pedidos antigos do localStorage
    migrateOldOrders() {
        try {
            // Verificar se há pedidos antigos em diferentes formatos
            const oldFreeOrders = localStorage.getItem('freeOrders');
            const oldCustomOrders = localStorage.getItem('customOrders');
            
            let migratedOrders = [];
            
            if (oldFreeOrders) {
                try {
                    const parsedFreeOrders = JSON.parse(oldFreeOrders);
                    console.log(`Encontrados ${parsedFreeOrders.length} pedidos gratuitos antigos para migrar`);
                    
                    const convertedFreeOrders = parsedFreeOrders.map(order => ({
                        id: Date.now() + Math.random().toString(36).substr(2, 9),
                        type: 'free',
                        name: order.name || 'Nome não informado',
                        email: order.email || 'email@exemplo.com',
                        orderDetails: order.orderDetails || order.message || 'Detalhes não informados',
                        youtubeVisibility: order.youtubeVisibility || 'unlisted',
                        additionalMessage: order.additionalMessage || '',
                        date: order.date || new Date().toISOString(),
                        status: 'pending',
                        priority: 'medium'
                    }));
                    
                    migratedOrders = migratedOrders.concat(convertedFreeOrders);
                } catch (error) {
                    console.error('Erro ao migrar pedidos gratuitos:', error);
                }
            }
            
            if (oldCustomOrders) {
                try {
                    const parsedCustomOrders = JSON.parse(oldCustomOrders);
                    console.log(`Encontrados ${parsedCustomOrders.length} pedidos personalizados antigos para migrar`);
                    
                    const convertedCustomOrders = parsedCustomOrders.map(order => ({
                        id: Date.now() + Math.random().toString(36).substr(2, 9),
                        type: 'custom',
                        name: order.name || 'Nome não informado',
                        email: order.email || 'email@exemplo.com',
                        orderDetails: order.orderDetails || order.message || 'Detalhes não informados',
                        deliveryMethod: order.deliveryMethod || 'google_drive',
                        additionalMessage: order.additionalMessage || '',
                        date: order.date || new Date().toISOString(),
                        status: 'pending',
                        priority: 'medium'
                    }));
                    
                    migratedOrders = migratedOrders.concat(convertedCustomOrders);
                } catch (error) {
                    console.error('Erro ao migrar pedidos personalizados:', error);
                }
            }
            
            if (migratedOrders.length > 0) {
                // Criar estrutura de dados
                const databaseData = {
                    orders: migratedOrders,
                    settings: {
                        freeOrdersEnabled: true,
                        customOrdersEnabled: true,
                        autoApprove: false,
                        lastUpdate: new Date().toISOString()
                    },
                    metadata: {
                        totalOrders: migratedOrders.length,
                        freeOrders: migratedOrders.filter(o => o.type === 'free').length,
                        customOrders: migratedOrders.filter(o => o.type === 'custom').length,
                        pendingOrders: migratedOrders.length,
                        approvedOrders: 0,
                        rejectedOrders: 0,
                        completedOrders: 0
                    }
                };

                // Salvar no novo formato
                this.saveToLocalStorage(databaseData);
                
                // Remover dados antigos
                localStorage.removeItem('freeOrders');
                localStorage.removeItem('customOrders');
                
                console.log('Migração de pedidos concluída com sucesso!');
                return databaseData;
            }
        } catch (error) {
            console.error('Erro na migração de pedidos:', error);
        }
        return null;
    }

    // Sincronizar dados
    async sync() {
        console.log('Iniciando sincronização de pedidos...');
        
        // Verificar se há pedidos antigos para migrar
        const migratedData = this.migrateOldOrders();
        
        // Carregar dados atuais
        const fileData = await this.loadFromFile();
        const localStorageData = this.loadFromLocalStorage();
        
        console.log('Dados do arquivo:', fileData);
        console.log('Dados do localStorage:', localStorageData);
        
        // Decidir qual fonte usar
        let finalData = null;
        
        if (fileData && localStorageData) {
            // Ambas as fontes existem, usar a mais recente
            const fileDate = new Date(fileData.settings?.lastUpdate || 0);
            const localDate = new Date(localStorageData.settings?.lastUpdate || 0);
            
            if (fileDate > localDate) {
                finalData = fileData;
                console.log('Usando dados do arquivo (mais recente)');
            } else {
                finalData = localStorageData;
                console.log('Usando dados do localStorage (mais recente)');
            }
        } else if (fileData) {
            finalData = fileData;
            console.log('Usando dados do arquivo');
        } else if (localStorageData) {
            finalData = localStorageData;
            console.log('Usando dados do localStorage');
        } else if (migratedData) {
            finalData = migratedData;
            console.log('Usando dados migrados');
        } else {
            // Criar estrutura vazia
            finalData = {
                orders: [],
                settings: {
                    freeOrdersEnabled: true,
                    customOrdersEnabled: true,
                    autoApprove: false,
                    lastUpdate: new Date().toISOString()
                },
                metadata: {
                    totalOrders: 0,
                    freeOrders: 0,
                    customOrders: 0,
                    pendingOrders: 0,
                    approvedOrders: 0,
                    rejectedOrders: 0,
                    completedOrders: 0
                }
            };
            console.log('Criando nova estrutura de dados');
        }
        
        // Atualizar metadados
        finalData.metadata = {
            totalOrders: finalData.orders.length,
            freeOrders: finalData.orders.filter(o => o.type === 'free').length,
            customOrders: finalData.orders.filter(o => o.type === 'custom').length,
            pendingOrders: finalData.orders.filter(o => o.status === 'pending').length,
            approvedOrders: finalData.orders.filter(o => o.status === 'approved').length,
            rejectedOrders: finalData.orders.filter(o => o.status === 'rejected').length,
            completedOrders: finalData.orders.filter(o => o.status === 'completed').length
        };
        
        // Salvar no localStorage
        this.saveToLocalStorage(finalData);
        
        console.log('Sincronização de pedidos concluída!');
        console.log('Estatísticas:', finalData.metadata);
        
        return finalData;
    }

    // Exportar dados para download
    exportData() {
        const data = this.loadFromLocalStorage();
        if (data) {
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pedidos_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            console.log('Dados exportados com sucesso!');
        } else {
            console.error('Nenhum dado para exportar');
        }
    }

    // Limpar todos os dados
    clearAllData() {
        if (confirm('⚠️ ATENÇÃO: Tem certeza que deseja limpar TODOS os dados de pedidos? Esta ação não pode ser desfeita!')) {
            localStorage.removeItem(this.localStorageKey);
            localStorage.removeItem('freeOrders'); // Remover dados antigos também
            localStorage.removeItem('customOrders'); // Remover dados antigos também
            console.log('Todos os dados de pedidos foram removidos!');
        }
    }

    // Adicionar novo pedido
    addOrder(orderData) {
        try {
            const data = this.loadFromLocalStorage();
            if (!data) {
                console.error('Nenhum banco de dados encontrado');
                return false;
            }

            const newOrder = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                ...orderData,
                date: new Date().toISOString(),
                status: 'pending',
                priority: 'medium'
            };

            data.orders.push(newOrder);
            data.settings.lastUpdate = new Date().toISOString();
            
            // Atualizar metadados
            data.metadata = {
                totalOrders: data.orders.length,
                freeOrders: data.orders.filter(o => o.type === 'free').length,
                customOrders: data.orders.filter(o => o.type === 'custom').length,
                pendingOrders: data.orders.filter(o => o.status === 'pending').length,
                approvedOrders: data.orders.filter(o => o.status === 'approved').length,
                rejectedOrders: data.orders.filter(o => o.status === 'rejected').length,
                completedOrders: data.orders.filter(o => o.status === 'completed').length
            };

            this.saveToLocalStorage(data);
            console.log('Pedido adicionado com sucesso:', newOrder);
            return true;
        } catch (error) {
            console.error('Erro ao adicionar pedido:', error);
            return false;
        }
    }
}

// Criar instância global
window.ordersSync = new OrdersSync();

// Funções de conveniência
window.syncOrders = () => window.ordersSync.sync();
window.exportOrders = () => window.ordersSync.exportData();
window.clearOrders = () => window.ordersSync.clearAllData();
window.migrateOrders = () => window.ordersSync.migrateOldOrders();
window.addOrder = (orderData) => window.ordersSync.addOrder(orderData);

console.log('OrdersSync carregado! Use:');
console.log('- syncOrders() para sincronizar');
console.log('- exportOrders() para exportar');
console.log('- clearOrders() para limpar');
console.log('- migrateOrders() para migrar dados antigos');
console.log('- addOrder(orderData) para adicionar novo pedido');













