interface CreateMonitorDto {
    keywords: string[];
    excludedKeywords?: string[];
    minPrice?: number;
    maxPrice?: number;
    conditions?: string[];
    sellers?: string[];
    email?: string;
    monitorInterval?: number;
  }
  
  interface Monitor {
    id: string;
    keywords: string[];
    isActive: boolean;
    excludedKeywords: string[];
    sellers: string[];
    minPrice?: number;
    maxPrice?: number;
    condition: string[];
    email?: string;
    monitorInterval?: number;
  }
  
  class MonitorService {
    private apiEndpoint = '/api/monitors';
  
    /**
     * Create a new monitor
     * @param data Monitor creation data
     * @param userId User ID to include in request headers
     * @returns The newly created monitor
     */
    async create(data: CreateMonitorDto, userId: string): Promise<Monitor> {
      // Validate required fields
      if (!data.keywords || data.keywords.length === 0) {
        throw new Error('Keywords are required');
      }
  
      const backendData = {
        keywords: data.keywords,
        excludedKeywords: data.excludedKeywords || [],
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        conditions: data.conditions || [],
        sellers: data.sellers || [],
        useLoginEmail: true,
        email: data.email,
        monitorInterval: data.monitorInterval
      };
  
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': userId,
          },
          body: JSON.stringify(backendData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to create monitor');
        }
  
        const responseData = await response.json();
        const monitor = responseData.monitor;
  
        // Transform the response to match the Monitor interface
        return {
          id: monitor.id,
          keywords: monitor.keywords,
          isActive: monitor.status === 'active',
          excludedKeywords: monitor.excludedKeywords || [],
          sellers: monitor.sellers || [],
          minPrice: monitor.minPrice,
          maxPrice: monitor.maxPrice,
          condition: monitor.conditions || [],
          email: responseData.emailStatus === 'verification_required'
            ? 'Verification required'
            : undefined,
          monitorInterval: monitor.monitorInterval,
        };
      } catch (error) {
        console.error('Error creating monitor:', error);
        throw error;
      }
    }
  
    /**
     * Get all monitors for the current user
     * @param userId User ID to include in request headers
     * @returns List of monitors and hasActiveEmail status
     */
    async getAll(userId: string): Promise<{monitors: Monitor[], hasActiveEmail: boolean}> {
      try {
        console.log('Fetching monitors from API endpoint');
        const response = await fetch(this.apiEndpoint, {
          headers: {
            'user-id': userId,
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || 'Failed to fetch monitors');
        }
  
        const data = await response.json();
        console.log('Received monitors data:', data);
  
        if (data && typeof data === 'object' && 'monitors' in data) {
          return {
            monitors: (data.monitors || []).map((monitor: any) => ({
              id: monitor.id,
              keywords: monitor.keywords || [],
              isActive: monitor.status === 'active',
              excludedKeywords: monitor.excludedKeywords || [],
              sellers: monitor.sellers || [],
              minPrice: monitor.minPrice,
              maxPrice: monitor.maxPrice,
              condition: monitor.conditions || [],
              monitorInterval: monitor.monitorInterval,
            })),
            hasActiveEmail: !!data.hasActiveEmail
          };
        } else {
          const monitorsArray = Array.isArray(data) ? data : [];
  
          return {
            monitors: monitorsArray.map((monitor: any) => ({
              id: monitor.id,
              keywords: monitor.keywords || [],
              isActive: monitor.status === 'active',
              excludedKeywords: monitor.excludedKeywords || [],
              sellers: monitor.sellers || [],
              minPrice: monitor.minPrice,
              maxPrice: monitor.maxPrice,
              condition: monitor.conditions || [],
              monitorInterval: monitor.monitorInterval,
            })),
            hasActiveEmail: true
          };
        }
      } catch (error) {
        console.error('Error fetching monitors:', error);
        throw error;
      }
    }
  
    /**
     * Update an existing monitor
     * @param id Monitor ID
     * @param updates Partial monitor data to update
     * @param userId User ID to include in request headers
     * @returns The updated monitor
     */
    async update(id: string, updates: Partial<Monitor>, userId: string): Promise<Monitor> {
      try {
        // Transform the updates to match the backend schema
        const backendUpdates = {
          ...updates,
          status: updates.isActive !== undefined 
            ? (updates.isActive ? 'active' : 'inactive') 
            : undefined,
          conditions: updates.condition, // Map condition to conditions
        };
  
        if (backendUpdates.isActive !== undefined) {
          delete backendUpdates.isActive;
        }
        if (backendUpdates.condition !== undefined) {
          delete backendUpdates.condition;
        }
  
        const response = await fetch(`${this.apiEndpoint}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'user-id': userId,
          },
          body: JSON.stringify(backendUpdates),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to update monitor');
        }
  
        const monitor = await response.json();
  
        return {
          id: monitor.id,
          keywords: monitor.keywords,
          isActive: monitor.status === 'active',
          excludedKeywords: monitor.excludedKeywords || [],
          sellers: monitor.sellers || [],
          minPrice: monitor.minPrice,
          maxPrice: monitor.maxPrice,
          condition: monitor.conditions || [],
          monitorInterval: monitor.monitorInterval,
        };
      } catch (error) {
        console.error('Error updating monitor:', error);
        throw error;
      }
    }
  
    /**
     * Delete a monitor
     * @param id Monitor ID
     * @param userId User ID to include in request headers
     */
    async delete(id: string, userId: string): Promise<void> {
      try {
        const response = await fetch(`${this.apiEndpoint}/${id}`, {
          method: 'DELETE',
          headers: {
            'user-id': userId,
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to delete monitor');
        }
      } catch (error) {
        console.error('Error deleting monitor:', error);
        throw error;
      }
    }
  
    /**
     * Toggle a monitor's active status
     * @param id Monitor ID
     * @param isActive New active status
     * @param userId User ID to include in request headers
     * @returns The updated monitor
     */
    async toggle(id: string, isActive: boolean, userId: string): Promise<Monitor> {
      return this.update(id, { isActive }, userId);
    }
  }
  
  const monitorService = new MonitorService();
  export default monitorService;
  